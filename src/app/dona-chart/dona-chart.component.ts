import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dona-chart',
  templateUrl: './dona-chart.component.html',
  styleUrls: ['./dona-chart.component.sass']
})
export class DonaChartComponent implements OnInit {
  @Input('totaltotal') totaltotal = 0
  @Input('tableLabel') tableLabel = ""
  @Input('totaltotalText') totaltotalText: any = null
  @Input('series') series = []
  @Input('esLegend') esLegend = true
  @Input('colorr') colorr = {domain: []}
  colores = {domain: []}
  totalDeMermas: any = 0

  constructor() {
  }

  ngOnInit(): void {
    console.log("this.series");
    console.log(this.series);
    console.log(this.colorr);
    /*if (this.colorr?.domain?.length == 0) {
      this.colorr.domain = this.series.map(o => o.color)
    }
    this.colorr.domain = this.series.map(o => o.color)*/
    console.log(this.colorr);
    //this.totalDeMermas = this.series.map(o => o.value).reduce((a, b) => a + b, 0)


    /*this.series = this.series.map(o => {
      return {...o, label: this.getPercent(o.value)+"%"}
    })*/


  }

  getPercent(v) {
    let percent: any = (v * 100) / this.totaltotal
    percent = percent.toFixed(0)
    return percent


  }


}
