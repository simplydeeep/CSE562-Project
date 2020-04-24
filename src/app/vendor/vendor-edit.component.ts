import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({ templateUrl: './vendor-edit.component.html' })
export class VendorEditComponent implements OnInit {

  public vendor = {
    vendorid: null,
    vendorname: '',
    vendoremail: '',
    vendorpassword: '',
    vendoraddress1: '',
    vendoraddress2: '',
    city: '',
    state: '',
    zipcode: '',
    vendorphone: '',
    cuisine: '',
    businesstype: ''
  };
  public orders: any = [];
  public menu: any = [];
  public drivers: any = [];
  public driverType = 'add';
  public dishType = 'add';
  public dish = {
    dishname: '',
    dishstatus: true,
    dishprice: 0
  };
  public tempDish = {
    dishname: '',
    dishstatus: true,
    dishprice: 0
  };
  public tempDriver = {
    drivername: '',
    driveremail: '',
    driverphone: 0,
    drivervehicle: ''
  };
  public driver = {
    drivername: '',
    driveremail: '',
    driverphone: 0,
    drivervehicle: ''
  };
  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params && this.activatedRoute.snapshot.params.id) {
      this.http.get('/api/vendor/' + this.activatedRoute.snapshot.params.id).subscribe(data => Object.assign(this.vendor, data));

      this.http.get('/api/vendor/' + this.activatedRoute.snapshot.params.id + '/orders').subscribe(data => this.orders = data);

      this.http.get('/api/vendor/' + this.activatedRoute.snapshot.params.id + '/menu').subscribe(data => this.menu = data);

      this.http.get('/api/vendor/' + this.activatedRoute.snapshot.params.id + '/drivers').subscribe(data => this.drivers = data);
    };
  }

  dishModal(content, type, dish = null) {
    if (type === 'edit') {
      this.dish = dish;
      this.dishType = type;
    } else {
      this.dish = this.tempDish;
    };
    this.modalService.open(content, { backdrop: 'static' }).result.then(
    (closed) => {
      console.log(this.dish);
      return this.addOrUpdate('dish', this.dishType, this.dish);
    }, (dismiss) => {
      this.dish = this.tempDish;
    });
  }

  driverModal(content, type, driver = null) {
    if (type === 'edit') {
      this.driver = driver;
      this.driverType = type;
    } else {
      this.driver = this.tempDriver;
    };
    this.modalService.open(content, { backdrop: 'static' }).result.then(
    (closed) => {
      return this.addOrUpdate('driver', this.driverType, this.driver);
    }, (dismiss) => {
      this.driver = this.tempDriver;
    });
  }

  addOrUpdate(type, itemType, item) {
    item['vendorid'] = this.vendor.vendorid;
    if (type == 'dish') {
      if (itemType === 'add') {
        return this.http.post('api/menu' , item).subscribe(response => {
          this.menu.push(response);
          this.toastr.success("Added Successfully");
          return response;
        });
      } else {
        return this.http.put('api/menu/' + item['dishid'], item).subscribe(response => {
          this.toastr.success("Edited Successfully");
          return response;
        });
      }
    } else if (type === 'driver') {
      if (itemType === 'add') {
        return this.http.post('api/driver' , item).subscribe(response => {
          this.drivers.push(response);
          this.toastr.success("Added Successfully");
          return response;
        });
      } else {
        return this.http.put('api/driver/' + item['driverid'], item).subscribe(response => {
          this.toastr.success("Edited Successfully");
          return response;
        });
      }
    }
  }

  delete(type, id) {
    if (type == 'dish') {
      return this.http.delete('/api/menu/' + id).subscribe(response => {
        this.toastr.success("Deleted Successfully");
        return response;
      });
    } else if (type === 'driver') {
      return this.http.delete('/api/driver/' + id).subscribe(response => {
        this.toastr.success("Deleted Successfully");
        return response;
      });
    }
  }

  onSubmit() {
    if (this.vendor.vendorid) {
      return this.http.put('api/vendor/' + this.vendor.vendorid, this.vendor).subscribe(data => {
          this.toastr.success("Edited Vendor Successfully");
          return Object.assign(this.vendor, data);
      });
    }
    return this.http.post('api/vendor', this.vendor).subscribe(data => Object.assign(this.vendor, data));
  }
}
