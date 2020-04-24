import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './home/signup.component';
import { AuthGuard } from './auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  }, {
    path: 'signup',
    component: SignupComponent,
  }, {
    path: 'customer',
    canActivate: [AuthGuard],
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
  }, {
    path: 'vendor',
    canActivate: [AuthGuard],
    loadChildren: () => import('./vendor/vendor.module').then(m => m.VendorModule),
  }, {
    path: 'order',
    canActivate: [AuthGuard],
    loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule {}
