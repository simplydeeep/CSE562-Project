import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({ templateUrl: './customer.component.html' })
export class CustomerComponent implements OnInit {

  public customers: any;
  constructor(
    protected router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get('/api/customer/list').subscribe(data => {
      this.customers = data;
      console.log(data);
    });
  }

  edit(id) {
    console.log(id);
    return this.router.navigate(['/customer/', id]);
  }

  delete(id) {
    return this.http.delete('api/customer/', id).subscribe(() => {console.log("good")});
  }
}
