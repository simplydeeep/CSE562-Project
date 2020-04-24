import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({ templateUrl: './home.component.html' })
export class HomeComponent {

  public currentUser: any = null;
  public email: string;
  public password: string;
  constructor(
    protected router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) {  }

  public login() {
    const params = {
      email: this.email,
      password: this.password
    }

    return this.http.post('api/login', { params }).pipe(
      catchError(err => {
        this.toastr.error("Invalid Credentials");
        return throwError(err);
      })
    ).subscribe(user => {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUser = user;
      this.toastr.success('Welcome, Logged In Successfully');
      if (this.currentUser.type === 'vendor') {
        this.router.navigate(['/vendor/' + this.currentUser.id]);
      } else {
        this.router.navigate(['/customer/' + this.currentUser.id]);
      }
      return user;
    });
  }
}
