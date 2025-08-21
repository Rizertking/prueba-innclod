import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Task } from '../../shared/models/task.model';
import { readCache, writeCache } from '../../shared/utils/local-cache';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private base = 'https://jsonplaceholder.typicode.com';
  private key: 'tasks' = 'tasks';

  constructor(private http: HttpClient) {}

  listByProject(projectId: number): Observable<Task[]> {
    const params = new HttpParams().set('userId', projectId.toString());
    return this.http.get<Task[]>(`${this.base}/todos`, { params }).pipe(
      map(api => {
        const cache = readCache<Task>(this.key);
        // 1) elimina borrados
        let data = api.filter(t => !cache.deletedIds.includes(t.id));
        // 2) overrides
        data = data.map(t => cache.overrides[t.id] ? { ...t, ...cache.overrides[t.id] } : t);
        // 3) creados locales del mismo proyecto
        const createdForProject = cache.created.filter(c => c.userId === projectId);
        return [...createdForProject, ...data];
      })
    );
  }

  get(id: number): Observable<Task> {
    const cache = readCache<Task>(this.key);
    if (cache.overrides[id]) return of(cache.overrides[id]);
    const created = cache.created.find(c => c.id === id);
    if (created) return of(created);
    return this.http.get<Task>(`${this.base}/todos/${id}`);
  }

  create(dto: Partial<Task>): Observable<Task> {
    const created: Task = {
      id: Date.now(),
      userId: dto.userId!,
      title: dto.title || 'Nueva tarea',
      completed: !!dto.completed
    };
    const cache = readCache<Task>(this.key);
    cache.created = [created, ...cache.created];
    writeCache<Task>(this.key, cache);
    return of(created);
  }

  update(id: number, dto: Partial<Task>): Observable<Task> {
    const cache = readCache<Task>(this.key);

    // 1) ¿es una tarea creada localmente?
    const idx = cache.created.findIndex(c => c.id === id);
    if (idx !== -1) {
      // actualizar el item en created
      const updated = { ...cache.created[idx], ...dto } as Task;
      cache.created[idx] = updated;
      writeCache<Task>(this.key, cache);
      return of(updated);
    }

    // 2) si viene de la API, usar overrides
    const current = cache.overrides[id] || { id, userId: dto.userId } as Task;
    const updated = { ...current, ...dto } as Task;
    cache.overrides[id] = updated;

    writeCache<Task>(this.key, cache);
    return of(updated);
  }

  delete(id: number) {
    const cache = readCache<Task>(this.key);
    cache.deletedIds = Array.from(new Set([...cache.deletedIds, id]));
    cache.created = cache.created.filter(c => c.id !== id);
    writeCache<Task>(this.key, cache);
    return of(true);
  }
}
