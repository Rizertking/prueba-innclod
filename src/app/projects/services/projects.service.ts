import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Project } from '../../shared/models/project.model';
import { readCache, writeCache } from '../../shared/utils/local-cache';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private base = 'https://jsonplaceholder.typicode.com';
  private key: 'projects' = 'projects';

  constructor(private http: HttpClient) {}

  list(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.base}/users`).pipe(
      map(api => {
        const cache = readCache<Project>(this.key);
        // 1) quita eliminados
        let data = api.filter(p => !cache.deletedIds.includes(p.id));
        // 2) aplica overrides
        data = data.map(p => cache.overrides[p.id] ? { ...p, ...cache.overrides[p.id] } : p);
        // 3) añade creados locales (sin colisionar ids)
        return [...cache.created, ...data];
      })
    );
  }

  get(id: number): Observable<Project> {
    const cache = readCache<Project>(this.key);
    if (cache.overrides[id]) return of(cache.overrides[id]);
    if (cache.created.find(c => (c as any).id === id)) return of(cache.created.find(c => (c as any).id === id)!);
    return this.http.get<Project>(`${this.base}/users/${id}`);
  }

  create(dto: Partial<Project>): Observable<Project> {
    // Genera id local
    const created: Project = { id: Date.now(), name: dto.name || 'Nuevo', email: dto.email, company: dto.company };
    const cache = readCache<Project>(this.key);
    cache.created = [created, ...cache.created];
    writeCache<Project>(this.key, cache);
    return of(created); // simulamos éxito inmediato
  }

  update(id: number, dto: Partial<Project>): Observable<Project> {
    const cache = readCache<Project>(this.key);

    // 1) ¿es un proyecto creado localmente?
    const idx = cache.created.findIndex(c => (c as any).id === id);
    if (idx !== -1) {
      const updated = { ...cache.created[idx], ...dto } as Project;
      cache.created[idx] = updated;
      writeCache<Project>(this.key, cache);
      return of(updated);
    }

    // 2) Si viene de la API, usa overrides
    const current = cache.overrides[id] || ({ id } as Project);
    const updated = { ...current, ...dto } as Project;
    cache.overrides[id] = updated;

    writeCache<Project>(this.key, cache);
    return of(updated);
  }

  delete(id: number) {
    const cache = readCache<Project>(this.key);
    cache.deletedIds = Array.from(new Set([...cache.deletedIds, id]));
    // por si estaba en created, lo removemos
    cache.created = cache.created.filter(c => (c as any).id !== id);
    writeCache<Project>(this.key, cache);
    return of(true);
  }
}
