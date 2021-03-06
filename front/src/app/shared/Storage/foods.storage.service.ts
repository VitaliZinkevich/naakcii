import {Injectable} from '@angular/core';
import {Storag} from './foods.storage.model';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FoodsStorageService {

  private storeUrl: string;

  constructor(private http: HttpClient) {
  }

  getAll() {
    this.storeUrl = window.location.hostname === 'localhost' ? 'http://178.124.206.42:8080/api/chain' : 'http://' + window.location.hostname +':8080/api/chain';
    return this.http.get<Storag[]>(this.storeUrl)
      .map(chainList => {
        return chainList.map(chain => {
          return {
            id: chain['id'],
            name: chain['name'],
            link: chain['link'],
            countGoods: chain['countGoods'],
            percent: chain['percent'],
            imgLogo: chain['imgLogo'],
            imgLogoSmall: chain['imgLogoSmall'],
            selected: false
          };
        });
      });
  }
}



