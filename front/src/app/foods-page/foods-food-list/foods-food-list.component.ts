import {Component, Inject, OnInit} from '@angular/core';
import {MODES, SHARED_STATE, SharedState} from '../sharedState.model';
import {Observable} from 'rxjs/Observable';
import {FoodList} from '../../shared/foodList/foods.foodList.model';
import {FoodsFoodListService} from '../../shared/foodList/foods.foodList.service';
import {FoodsStorageService} from '../../shared/Storage/foods.storage.service';
import {Storag} from '../../shared/Storage/foods.storage.model';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-foods-food-list',
  templateUrl: './foods-food-list.component.html',
  styleUrls: ['./foods-food-list.component.css'],
  providers: [FoodsFoodListService, FoodsStorageService]
})
export class FoodsFoodListComponent implements OnInit {
  foodList: FoodList[] = [];
  private curFoodCard: FoodList;
  selectedSubCatListID = [];
  chainList: Storag[] = null;
  countLoadCard: number = 0;
  loadedCard: number = 6;
  isNextCard: boolean = false;

  throttle = 50;
  scrollDistance =2;
  scrollUpDistance = 1;

  constructor(private chainService: FoodsStorageService,
              private foodsService: FoodsFoodListService,
              @Inject(SHARED_STATE) private stateEvents: Observable<SharedState>) {
    console.log('FoodListComponent - constr');
  }

  ngOnInit() {
    console.log('FoodListComponent - ngOnInit');

    this.chainService.getAll().subscribe(chainList => {
      console.log(chainList);
      this.chainList = chainList;
    });

    this.stateEvents.subscribe((update) => {
      if (update.mode === MODES.SELECT_SUBCATEGORY) {
        this.foodList = [];
        this.selectedSubCatListID = [];
        if (update.subCatList) {
         for (let i = 0; i < update.subCatList.length; i++) {
            if (update.subCatList[i].selected) {
              this.selectedSubCatListID.push({id: update.subCatList[i].id});
            }
          }
          if (this.selectedSubCatListID.length > 0) {
            this.countLoadCard = 0;
            let first = this.countLoadCard * this.loadedCard;
            let last = this.loadedCard*(this.countLoadCard+1);
            console.log('first: ' + first + '; last: ' + last);
            this.foodsService.getFoodList(this.selectedSubCatListID, first, last).subscribe(productList => {
              productList.map(product => {
                this.foodList.push(product);
              });
              if (productList.length == this.loadedCard) {
                this.isNextCard = true;
                this.countLoadCard += 1;
              } else {
                this.isNextCard = false;
              }
            });
          }
        }
      }
      if (update.mode === MODES.SELECT_CHAIN) {
        this.chainList = update.chainList;
        this.chainList.map(chain => {
          //console.log('id: ' + chain.id + ' - ' + chain.selected);
        });
      }
    });
  }

  //проверяем есть ли для выбранных сетей товары
  isVisibleProd() {
    let isProduct = false;
    this.foodList.map(food => {
      this.chainList.map(chain => {
        if (chain.id === food.idStrore) {
          if (chain.selected) {
            isProduct = true;
          }
        }
      });
    });
    return isProduct;
  }
  //проверяем есть ли хоть одна выбранная сеть
  isCheckedChain() {
    let isChain = false;
    this.chainList.map(chain => {
      if (chain.selected) {
        isChain = true;
      }
    });
    return isChain;
  }

  onScrollDown() {
    console.log("scrolled!!");
    if (!this.isNextCard) {
      return;
    }
    let first = this.countLoadCard * this.loadedCard;
    let last = this.loadedCard*(this.countLoadCard+1);
    console.log('countCard: ' + this.countLoadCard + '; first: ' + first + '; last: ' + last);
    this.foodsService.getFoodList(this.selectedSubCatListID, first, last).subscribe(productList => {
      if (productList) {
        productList.map(product => {
          this.foodList.push(product);
        });
        if (productList.length == this.loadedCard) {
          this.isNextCard = true;
          this.countLoadCard += 1;
        } else {
          this.isNextCard = false;
        }
      }

    });
  }
}
