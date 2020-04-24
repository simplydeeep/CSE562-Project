import { NgModule } from '@angular/core';
import { CustomerEditComponent } from './customer-edit.component';
import { CustomerComponent } from './customer.component';
import { CustomerRoutingModule } from './customer.routes';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule
  ],
  declarations: [
    CustomerEditComponent,
    CustomerComponent
  ]
})
export class CustomerModule {}
