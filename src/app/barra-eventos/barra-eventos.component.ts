import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-barra-eventos',
  templateUrl: './barra-eventos.component.html',
  styleUrls: ['./barra-eventos.component.sass']
})
export class BarraEventosComponent implements OnInit {

  @Input("totalEventos") totalEventos = 0;
  @Input("duracion") duracion = 0;


  constructor() { }

  ngOnInit(): void {
  }

}
