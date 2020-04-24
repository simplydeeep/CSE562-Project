import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({ templateUrl: './order.component.html' })
export class OrderComponent implements OnInit {

  public vendors: any;
  public menu$: Observable<any>;
  public quantities: any = {};
  public items: any = {};
  public tempItems: any = {};
  public pickedVendor: any = {};
  public drivers: any = [];
  public deliverytype = "Delivery";
  public deliverytypes = ["Delivery", "Pickup"];
  constructor(
    protected router: Router,
    private http: HttpClient,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.http.get('/api/vendor/list').subscribe(data => {
      this.vendors = data;
    });
  }

  menuModal(content, id) {
    this.tempItems = {};
    this.menu$ = this.http.get('/api/vendor/' + id + '/menu');
    this.http.get('/api/vendor/' + id + '/drivers').subscribe(data => this.drivers = data);

    this.modalService.open(content, { backdrop: 'static' }).result.then(
    (closed) => {
      this.items = this.tempItems;
      return this.pickedVendor = this.vendors.find(({ vendorid }) => vendorid === id );
    }, (dismiss) => {
      return;
    });
  }

  update(dish, qty) {
    dish['qty'] = qty;
    dish['amount'] = qty * dish.dishprice;
    this.tempItems[dish.dishid] = dish;
  }

  delete(id) {
    delete this.items[id];
  }

  public orderTotal() {
    return Object.values(this.items).reduce(function(acc, obj: any) {
      return acc + obj.amount;
    }, 0);
  }

  checkItems() {
    return Object.keys(this.items).length === 0;
  }

  placeOrder() {
    let order = {};
    order['main'] = {
      'customerid': JSON.parse(sessionStorage.getItem('currentUser')).id,
      'vendorid': this.pickedVendor.vendorid,
      'ordertotal': this.orderTotal(),
      'deliverytype': this.deliverytype,
    }
    order['details'] = this.items;

    if (this.drivers.length > 0) {
      return this.http.post('api/order', order).pipe(
        catchError(err => {
          this.toastr.error("Something is Wrong");
          return throwError(err);
        })
      ).subscribe((response: any) => {
        this.pickedVendor = {};
        this.items = {};
        this.tempItems = {};
        this.toastr.success('Order is Placed Successfully');
        this.router.navigate(['order/' + response.orderid]);
      })
    } else {{
      this.toastr.error("Cannot Place Order as No Drivers Available");
    }}
  }
}
