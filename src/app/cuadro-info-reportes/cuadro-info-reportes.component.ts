import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-cuadro-info-reportes',
  templateUrl: './cuadro-info-reportes.component.html',
  styleUrls: ['./cuadro-info-reportes.component.sass']
})
export class CuadroInfoReportesComponent implements OnInit {
  @Input("color") color;
  @Input("titl") titl;
  @Input("valor") valor;
  @Input("chico") chico;
  constructor() { }

  ngOnInit(): void {
  }

}
