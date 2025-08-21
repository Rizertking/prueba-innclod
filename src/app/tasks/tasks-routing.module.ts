import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent as TasksListComponent } from './pages/list.component';
import { EditComponent as TaskEditComponent } from './pages/edit.component';

const routes: Routes = [
  // /tasks?projectId=XX  → lista filtrada por proyecto (leer queryParam en el componente)
  { path: '', component: TasksListComponent },

  // /tasks/new  → crear tarea (puedes pasar projectId por queryParam o state)
  { path: 'new', component: TaskEditComponent },

  // /tasks/:id  → editar tarea
  { path: ':id', component: TaskEditComponent },

  // opcional: wildcard local
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
