import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule }  from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }  from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

// 👇 NUEVO: toolbar y progress bar
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ProjectsService } from '../services/projects.service';
import { Project } from '../../shared/models/project.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSnackBarModule, MatDialogModule,
    MatCardModule,
    // 👇 NUEVO
    MatToolbarModule, MatProgressBarModule,
    ConfirmDialogComponent,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  displayedColumns = ['id', 'name', 'company', 'actions'];

  // estado (signals)
  data = signal<Project[]>([]);
  loading = signal(false);

  // 👇 NUEVO: filtro básico
  searchTerm = signal('');
  dataFiltered = signal<Project[]>([]);

  constructor(
    private svc: ProjectsService,
    private router: Router,
    private dialog: MatDialog,
    private sb: MatSnackBar,
    private auth: AuthService
  ) {}

  ngOnInit() { this.fetch(); }

  fetch() {
    this.loading.set(true);
    this.svc.list().subscribe({
      next: (res) => {
        this.data.set(res);
        this.applyFilter();          
        this.loading.set(false);
      },
      error: _ => {
        this.sb.open('Error cargando proyectos', 'Cerrar', { duration: 2500 });
        this.loading.set(false);
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth']); // ruta de login
  }

  onSearch(term: string) {
    this.searchTerm.set(term.toLowerCase().trim());
    this.applyFilter();
  }
  private applyFilter() {
    const term = this.searchTerm();
    if (!term) { this.dataFiltered.set(this.data()); return; }
    this.dataFiltered.set(
      this.data().filter(p =>
        (''+p.id).includes(term) ||
        p.name?.toLowerCase().includes(term) ||
        p.company?.name?.toLowerCase().includes(term) ||
        (p as any).email?.toLowerCase?.().includes(term)
      )
    );
  }

  goNew()      { this.router.navigate(['/projects/new']); }
  goEdit(p: Project) { this.router.navigate(['/projects', p.id]); }
  goTasks(p: Project) { this.router.navigate(['/tasks'], { queryParams: { projectId: p.id } }); }

  confirmDelete(p: Project) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar proyecto', message: `¿Eliminar "${p.name}"?` }
    }).afterClosed().subscribe(ok => {
      if (ok) {
        this.svc.delete(p.id).subscribe({
          next: _ => { this.sb.open('Proyecto eliminado', 'Cerrar', { duration: 2000 }); this.fetch(); },
          error: _ => this.sb.open('Error eliminando', 'Cerrar', { duration: 2500 })
        });
      }
    });
  }
}
