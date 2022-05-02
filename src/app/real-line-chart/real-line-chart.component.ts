import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-real-line-chart',
  templateUrl: './real-line-chart.component.html',
  styleUrls: ['./real-line-chart.component.sass']
})
export class RealLineChartComponent implements OnInit {
  @Input('resuls') resuls = [{name: 'velocidad de la maquina', series: [{name: 2010, value: 900}, {name: 2011, value: 600}]}]

  constructor() {
  }

  ngOnInit(): void {
  }


  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  subir() {
    console.log("subiendo");
    this.resuls = [{name: 'velocidad de la maquina', series: [{name: 2010, value: 900}, {name: 2011, value: 600}, {name: 2012, value: 100}]}]

    /*
    this.resuls[0].series.push( {name: 2012, value: 100})*/
  }
}
