import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-notificacion-emergente',
  templateUrl: './notificacion-emergente.component.html',
  styleUrls: ['./notificacion-emergente.component.sass']
})
export class NotificacionEmergenteComponent implements OnInit {

  cerrar = false
  @Input("header") header
  @Input("tipo") tipo
  @Input("body") body

  constructor() { }

  ngOnInit(): void {
  }

}
