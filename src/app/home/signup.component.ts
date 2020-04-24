import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError, map, filter, switchMap } from 'rxjs/operators';

@Component({ templateUrl: './signup.component.html' })
export class SignupComponent {

  public user: any = {};
  constructor(
    protected router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  public onSubmit() {
    return this.http.get('/api/check-email/' + this.user.email).pipe(
      map((response: []) => {
        if (response.length > 0) {
          this.toastr.error("This email is already used");
        }
        return response.length > 0;
      }),
      filter(response => !response),
      switchMap(() => {
        if (this.user.type === 'vendor') {
          return this.http.post('api/vendor/signup', this.user).pipe(
            catchError(err => {
              this.toastr.error("Something is Wrong");
              return throwError(err);
            })
          )
        } else {
          return this.http.post('api/customer/signup', this.user).pipe(
            catchError(err => {
              this.toastr.error("Something is Wrong");
              return throwError(err);
            })
          )
        }
      })
    ).subscribe((response: any) => {
      if (this.user.type === 'vendor') {
        this.toastr.success("Added Vendor Successfully");
        return this.router.navigate(['']);
      } else {
        this.toastr.success("Added Customer Successfully");
        return this.router.navigate(['']);
      }
    })
  }
}
