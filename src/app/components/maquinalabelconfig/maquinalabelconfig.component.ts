import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maquinalabelconfig',
  templateUrl: './maquinalabelconfig.component.html',
  styleUrls: ['./maquinalabelconfig.component.sass']
})
export class MaquinalabelconfigComponent implements OnInit {

  oculto = false;

  constructor() { }

  ocultar(){
    this.oculto = !this.oculto;
    return this.oculto
  }
  ngOnInit(): void {
  }

}
