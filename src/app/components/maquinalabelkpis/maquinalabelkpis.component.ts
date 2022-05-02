import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maquinalabelkpis',
  templateUrl: './maquinalabelkpis.component.html',
  styleUrls: ['./maquinalabelkpis.component.sass']
})
export class MaquinalabelkpisComponent implements OnInit {

  oculto = false;

  constructor() { }

  ocultar(){
    this.oculto = !this.oculto;
    return this.oculto
  }


  ngOnInit(): void {
  }

}
