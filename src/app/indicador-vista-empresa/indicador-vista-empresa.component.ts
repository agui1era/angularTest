import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-indicador-vista-empresa',
  templateUrl: './indicador-vista-empresa.component.html',
  styleUrls: ['./indicador-vista-empresa.component.sass']
})
export class IndicadorVistaEmpresaComponent implements OnInit {
  @Input("chico") chico:any = false
  @Input("label") label:any = false
  @Input("valu") valu:any = false
  @Input("laLetra") laLetra:any = 1.2
  @Input("bl") bl:any = false

  bueno = false
  malo = false
  regular = false

  constructor() { }

  ngOnInit(): void {
    if(this.valu > 70){
      this.bueno = true

    }else if(this.valu > 50){
      this.regular = true

    }else {
      this.malo = true
    }

  }

}
