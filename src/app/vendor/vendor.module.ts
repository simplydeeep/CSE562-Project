import { NgModule } from '@angular/core';
import { VendorComponent } from './vendor.component';
import { VendorEditComponent } from './vendor-edit.component';
import { VendorRoutingModule } from './vendor.routes';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    VendorRoutingModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    VendorComponent,
    VendorEditComponent
  ]
})
export class VendorModule {}
