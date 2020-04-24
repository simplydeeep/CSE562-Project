import { RouterModule, Routes } from '@angular/router';
import { VendorComponent } from './vendor.component';
import { VendorEditComponent } from './vendor-edit.component';
import { NgModule } from '@angular/core';

export const vendorRoutes: Routes = [
  {
    path: '',
    component: VendorComponent,
  }, {
    path: ':id',
    component: VendorEditComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(vendorRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class VendorRoutingModule {}
