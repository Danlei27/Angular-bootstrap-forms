import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFormComponent } from './date-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    DateFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule
     
  ]
})
export class DateFormModule { }
