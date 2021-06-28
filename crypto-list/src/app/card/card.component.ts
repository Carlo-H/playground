import { Component, OnInit, Input } from '@angular/core';

interface Coin {
  name: string;
  value: number;
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() coin: Coin;
  cardColor: string = '';

  constructor() {}

  ngOnInit(): void {
    this.cardColor = this.getRandomColor();
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
