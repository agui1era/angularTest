import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-ot-progress',
  templateUrl: './ot-progress.component.html',
  styleUrls: ['./ot-progress.component.sass']
})
export class OtProgressComponent implements OnInit {

  @Input("alerta") alerta: any = false;
  @Input("nombreMaquina") nombreMaquina: any = "";
  @Input("nombreOt") nombreOt: any = "";
  @Input("fechaOT") fechaOT: any = "";
  @Input("cant") cant: any = '10';
  progress = 0
  constructor() { }

  ngOnInit(): void {
    this.progress = this.cant.toString()
    this.cant = 100 - this.cant
  }

}
