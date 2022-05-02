import {Component, OnInit} from '@angular/core';
import {NotificacionesService} from "@app/_services/notificaciones.service";
import * as moment from "moment";
import * as io from "socket.io-client";
import {environment} from "@environments/environment";

@Component({
  selector: 'app-notificaciones-viewer',
  templateUrl: './notificaciones-viewer.component.html',
  styleUrls: ['./notificaciones-viewer.component.sass']
})
export class NotificacionesViewerComponent implements OnInit {

  misNotificaciones: any = []
  private socket: any;


  constructor(
    private notificacionesService: NotificacionesService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.socket = io.io(environment.apiUrl);
    this.socket.on('notificacionCreada', data => {
      this.cargarNotif().then(ok=>{})
    })
    moment.locale("es")
    await this.cargarNotif()

  }

  async cargarNotif(){
    this.misNotificaciones = await this.notificacionesService.getAll().toPromise()
    this.misNotificaciones = this.misNotificaciones.map(o => {
      return {
        ...o,
        tiempoRelativo: moment(o.createdAt).fromNow()
      }
    })
  }

  async leer(noti) {
    await this.notificacionesService.leer(noti.id).toPromise()
    await this.cargarNotif()
    this.notificacionesService.noLeidas()
  }

}
