import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFormComponent } from './date-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DateFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ]
})
export class DateFormModule { }
