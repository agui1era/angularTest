import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-horizon-chart',
  templateUrl: './horizon-chart.component.html',
  styleUrls: ['./horizon-chart.component.sass']
})
export class HorizonChartComponent implements OnInit {
  @Input('realW') realW:any = 0.50;
  @Input('name') name = undefined;
  @Input('color') color = "";
  @Input('title2') title2 = "";
  @Input('title1') title1 = "";
  @Input('cant1') cant1 = "";
  @Input('cant2') cant2 = "";

  constructor() { }

  ngOnInit(): void {

  }




}
