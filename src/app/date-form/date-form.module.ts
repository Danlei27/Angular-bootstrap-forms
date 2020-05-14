import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFormComponent } from './date-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    DateFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
     
  ]
})
export class DateFormModule { }
