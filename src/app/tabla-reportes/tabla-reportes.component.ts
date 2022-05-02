import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tabla-reportes',
  templateUrl: './tabla-reportes.component.html',
  styleUrls: ['./tabla-reportes.component.sass']
})
export class TablaReportesComponent implements OnInit {
  @Input('records') records = []


  constructor() { }

  ngOnInit(): void {
  }

}
