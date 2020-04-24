import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  title = 'DBMS Project';
  constructor(
    protected router: Router,
    private toastr: ToastrService
  ) { }

  logout() {
        sessionStorage.clear();
        this.toastr.success('Bye, Logged Out Successfully');
        return this.router.navigate(['']);
    }
}
