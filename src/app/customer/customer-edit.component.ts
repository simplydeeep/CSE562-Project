import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({ templateUrl: './customer-edit.component.html' })
export class CustomerEditComponent implements OnInit {

  public customer = {
    customerid: null,
    customername: '',
    customeremail: '',
    customerpassword: '',
    customeraddress1: '',
    customeraddress2: '',
    city: '',
    state: '',
    zipcode: 0,
    customerphone: 0
  };
  public orders: any = [];
  public rewards: any;
  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params && this.activatedRoute.snapshot.params.id) {
      this.http.get('/api/customer/' + this.activatedRoute.snapshot.params.id).subscribe(data => Object.assign(this.customer, data));

      this.http.get('/api/customer/' + this.activatedRoute.snapshot.params.id + '/orders').subscribe(data => this.orders = data);

      this.http.get('api/customer/' + this.activatedRoute.snapshot.params.id + '/rewards').subscribe(data => this.rewards = data);
    };
  }

  onSubmit() {
    if (this.customer.customerid) {
      return this.http.put('api/customer/' + this.customer.customerid, this.customer).subscribe(data => {
        this.toastr.success("Edited Customer Successfully");
        return Object.assign(this.customer, data);
      });
    }
    return this.http.post('api/customer/signup', this.customer).subscribe(data => Object.assign(this.customer, data));
  }
}
