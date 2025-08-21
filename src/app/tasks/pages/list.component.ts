import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

// 👇 NUEVO: tarjeta, toolbar, iconos y barra de progreso
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TasksService } from '../services/tasks.service';
import { Task } from '../../shared/models/task.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, MatButtonModule, MatCheckboxModule,
    MatSnackBarModule, MatDialogModule,
    MatFormFieldModule, MatInputModule,
    MatCardModule, MatToolbarModule, MatIconModule, MatTooltipModule, MatProgressBarModule,
    ConfirmDialogComponent,


  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  displayedColumns = ['id', 'title', 'completed', 'actions'];

  // estado
  data = signal<Task[]>([]);
  loading = signal(false);
  projectId!: number;

  // 👇 NUEVO: filtro simple
  searchTerm = signal('');
  dataFiltered = signal<Task[]>([]);

  constructor(
    private svc: TasksService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private sb: MatSnackBar
  ) {}

  ngOnInit() {
    this.projectId = +(this.route.snapshot.queryParamMap.get('projectId') || 0);
    if (!this.projectId) {
      this.sb.open('Falta projectId en la URL', 'Cerrar', { duration: 2500 });
      this.router.navigate(['/projects']);
      return;
    }
    this.fetch();
  }

  fetch() {
    this.loading.set(true);
    this.svc.listByProject(this.projectId).subscribe({
      next: res => { this.data.set(res); this.applyFilter(); this.loading.set(false); },
      error: _  => { this.sb.open('Error cargando tareas', 'Cerrar', { duration: 2500 }); this.loading.set(false); }
    });
  }

  // 👇 NUEVO
  onSearch(term: string) {
    this.searchTerm.set(term.toLowerCase().trim());
    this.applyFilter();
  }
  private applyFilter() {
    const term = this.searchTerm();
    if (!term) { this.dataFiltered.set(this.data()); return; }
    this.dataFiltered.set(
      this.data().filter(t =>
        (''+t.id).includes(term) ||
        t.title.toLowerCase().includes(term)
      )
    );
  }

  goNew() { this.router.navigate(['/tasks/new'], { queryParams: { projectId: this.projectId } }); }
  goEdit(t: Task) { this.router.navigate(['/tasks', t.id], { queryParams: { projectId: this.projectId } }); }
  goBack() { this.router.navigate(['/projects']); }

  confirmDelete(t: Task) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar tarea', message: `¿Eliminar "${t.title}"?` }
    }).afterClosed().subscribe(ok => {
      if (ok) {
        this.svc.delete(t.id).subscribe({
          next: _ => { this.sb.open('Tarea eliminada', 'Cerrar', { duration: 2000 }); this.fetch(); },
          error: _ => this.sb.open('Error eliminando', 'Cerrar', { duration: 2500 })
        });
      }
    });
  }
}
