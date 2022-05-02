import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-indicador',
  templateUrl: './indicador.component.html',
  styleUrls: ['./indicador.component.sass']
})
export class IndicadorComponent implements OnInit {
  @Input("valu") valu:any = 0
  @Input("activo") activo:any = false
  @Input("label") label:any = "no informado"
  @Input("chico") chico:any = 1
  @Input("nt") nt:any = false


  constructor() { }

  ngOnInit(): void {
  }

}
