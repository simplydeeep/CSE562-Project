import { NgModule } from '@angular/core';
import { OrderComponent } from './order.component';
import { OrderViewComponent } from './order-view.component';
import { OrderRoutingModule } from './order.routes';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    OrderRoutingModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    OrderComponent,
    OrderViewComponent
  ]
})
export class OrderModule {}
