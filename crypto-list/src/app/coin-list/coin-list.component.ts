import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CoingeckoService } from '../services/coingecko.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Coin {
  name: string;
  value: number;
}

interface CoingeckCoin {
  id: string;
  name: string;
  symbol: string;
}

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  providers: [CoingeckoService],
  styleUrls: ['./coin-list.component.css'],
})
export class CoinListComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  coins: Coin[] = [];
  coinList: string[] = [];
  selectedCoins: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  coinCtrl = new FormControl();
  filteredCoins: Observable<string[]>;

  @ViewChild('coinInput') coinInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private coingeckoService: CoingeckoService) {
    this.filteredCoins = this.coinCtrl.valueChanges.pipe(
      map((coin: string | null) =>
        coin ? this._filter(coin) : this.coinList.slice()
      )
    );
  }

  ngOnInit(): void {
    this.selectedCoins = this.coinList;
    this.getAllCoins();
    this.getCoins();
  }

  getAllCoins(): void {
    this.coingeckoService.getAllCoins().subscribe((data: CoingeckCoin[]) => {
      this.coinList = data.map((coin) => coin.id);
    });
  }

  getCoins(): void {
    //dogecoin%2Cecomi%2Cshiba-inu%2Cuniswap%2Cpancakeswap-token%2Cpandacoin
    const query = this.selectedCoins.join('%2C');
    this.coingeckoService.getCoins(query).subscribe((data) => {
      this.coins = [];
      Object.keys(data).forEach(function (key) {
        this.coins.push({ name: key, value: data[key].usd });
      }, this);
    });
  }

  add(event: MatChipInputEvent): void {
    console.warn('you can`t add random coins!');
  }

  remove(coin: string): void {
    const index = this.selectedCoins.indexOf(coin);

    if (index >= 0) {
      this.selectedCoins.splice(index, 1);
    }
    this.getCoins();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedCoins.push(event.option.viewValue);
    this.coinInput.nativeElement.value = '';
    this.coinCtrl.setValue(null);
    this.getCoins();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.coinList.filter(
      (coin) => coin.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
