import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { CustomerEditComponent } from './customer-edit.component';
import { NgModule } from '@angular/core';

export const customerRoutes: Routes = [
  {
    path: '',
    component: CustomerComponent,
  }, {
    path: ':id',
    component: CustomerEditComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(customerRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CustomerRoutingModule {}
