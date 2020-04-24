import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order.component';
import { OrderViewComponent } from './order-view.component';
import { NgModule } from '@angular/core';

export const orderRoutes: Routes = [
  {
    path: '',
    component: OrderComponent,
  }, {
    path: ':id',
    component: OrderViewComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(orderRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class OrderRoutingModule {}
