import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-progreso-chart',
  templateUrl: './progreso-chart.component.html',
  styleUrls: ['./progreso-chart.component.sass']
})
export class ProgresoChartComponent implements OnInit {

  @Input('label') label: string = "Producción";
  @Input('percent') percent: number = 100;
  @Input('selected') selected: any = false;

  constructor() { }

  ngOnInit(): void {
  }

}
