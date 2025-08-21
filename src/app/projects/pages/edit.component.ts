import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }  from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ProjectsService } from '../services/projects.service';

@Component({
  selector: 'app-project-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule,
    MatCardModule, MatProgressBarModule,
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {
  form!: FormGroup;
  id: number | null = null;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private svc: ProjectsService,
    private route: ActivatedRoute,
    private router: Router,
    private sb: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      description: ['']
    });

    const rawId = this.route.snapshot.paramMap.get('id');
    this.id = rawId ? +rawId : null;

    if (this.id) {
      this.svc.get(this.id).subscribe({
        next: p => this.form.patchValue({ name: p.name, description: p.company?.name || p.email }),
        error: _ => this.sb.open('Error cargando proyecto', 'Cerrar', { duration: 2500 })
      });
    }
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;

    const dto = { name: this.form.value.name, company: { name: this.form.value.description } };

    const req$ = this.id
      ? this.svc.update(this.id, dto)
      : this.svc.create(dto);

    req$.subscribe({
      next: _ => { this.sb.open('Guardado', 'Cerrar', { duration: 2000 }); this.router.navigate(['/projects']); },
      error: _ => this.sb.open('Error guardando', 'Cerrar', { duration: 2500 }),
      complete: () => this.saving = false
    });
  }

  cancel() { this.router.navigate(['/projects']); }
}
