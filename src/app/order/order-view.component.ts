import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({ templateUrl: './order-view.component.html' })
export class OrderViewComponent implements OnInit {

  public order: any = {};
  public items: any = [];
  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params && this.activatedRoute.snapshot.params.id) {
      this.http.get('/api/order/' + this.activatedRoute.snapshot.params.id).subscribe(data => {
        Object.assign(this.order, data);
      });

      this.http.get('api/order/' + this.activatedRoute.snapshot.params.id + '/items').subscribe(data => this.items = data);
    }
  }
}
