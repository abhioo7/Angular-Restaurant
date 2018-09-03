import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { baseURL } from '../shared/baseURL';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { RestangularModule, Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
@Injectable()
export class DishService {
  constructor(private http: Http,
            private processHTTPMsgService: ProcessHTTPMsgService,
            private restangular: Restangular) { }

getDishes(): Observable<Dish[]> {
  return this.restangular.all('dishes').getList();
}

getDish(id: number): Observable<Dish> {
  return  this.restangular.one('dishes',id).get();
}

getFeaturedDish(): Observable<Dish> {
  return this.restangular.all('dishes').getList({featured: true})
    .map(dishes => dishes[0]);
}

getDishIds(): Observable<number[]> {
  return this.getDishes()
    .map(dishes => { return dishes.map(dish => dish.id) });

}
postComment(dishId: number, comment: any) {
return this.http.post(baseURL + 'dishes/' + dishId + '/comments', comment)
.catch(error => { return this.processHTTPMsgService.handleError(error); });
}
}
