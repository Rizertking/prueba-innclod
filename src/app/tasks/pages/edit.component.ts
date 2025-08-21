import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }  from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { finalize } from 'rxjs/operators';             // 👈 añade esto
import { TasksService } from '../services/tasks.service';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule,
    MatCheckboxModule, MatCardModule, MatProgressBarModule
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);             // 👈 inyecta CDR

  form!: FormGroup;
  id: number | null = null;
  projectId!: number;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private svc: TasksService,
    private route: ActivatedRoute,
    private router: Router,
    private sb: MatSnackBar
  ) {}

  ngOnInit() {
    this.projectId = +(this.route.snapshot.queryParamMap.get('projectId') || 0);
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      completed: [false],
    });

    const rawId = this.route.snapshot.paramMap.get('id');
    this.id = rawId ? +rawId : null;

    if (this.id) {
      this.svc.get(this.id).pipe(
        finalize(() => this.cdr.detectChanges())        // 👈 fuerza render al terminar
      ).subscribe({
        next: t => this.form.patchValue({ title: t.title, completed: t.completed }),
        error: _ => this.sb.open('Error cargando tarea', 'Cerrar', { duration: 2500 })
      });
    }
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;

    const dto = {
      userId: this.projectId,
      title: this.form.value.title,
      completed: this.form.value.completed
    };

    const req$ = this.id ? this.svc.update(this.id, dto) : this.svc.create(dto);

    req$.pipe(
      finalize(() => { this.saving = false; this.cdr.detectChanges(); }) // 👈
    ).subscribe({
      next: _ => {
        this.sb.open('Guardado', 'Cerrar', { duration: 2000 });
        this.router.navigate(['/tasks'], { queryParams: { projectId: this.projectId } });
      },
      error: _ => this.sb.open('Error guardando', 'Cerrar', { duration: 2500 })
    });
  }

  cancel() { this.router.navigate(['/tasks'], { queryParams: { projectId: this.projectId } }); }
}
