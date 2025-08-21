import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent as ProjectsListComponent } from './pages/list.component';
import { EditComponent as ProjectEditComponent } from './pages/edit.component';

const routes: Routes = [
  // /projects  → lista de proyectos
  { path: '', component: ProjectsListComponent },

  // /projects/new  → crear proyecto
  { path: 'new', component: ProjectEditComponent },

  // /projects/:id  → editar proyecto (o ver detalle si tu edit actúa como detalle)
  { path: ':id', component: ProjectEditComponent },

  // opcional: wildcard local
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
