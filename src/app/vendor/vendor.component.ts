import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({ templateUrl: './vendor.component.html' })
export class VendorComponent implements OnInit {

  public customers: any;
  constructor(
    protected router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get('/api/vendor/list').subscribe(data => {
      this.customers = data;
      console.log(data);
    });
  }

  delete(id) {
    return this.http.delete('api/customer/', id).subscribe(() => {console.log("good")});
  }
}
