import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateFormComponent } from './template-form/template-form.component';
import { DateFormComponent } from './date-form/date-form.component';


const routes: Routes = [
  { path: 'templateForm', component: TemplateFormComponent},
  { path: 'dataForm', component: DateFormComponent},
  { path: '', pathMatch: 'full', redirectTo: 'dataForm'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
