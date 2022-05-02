import {Component, ComponentFactoryResolver, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, ActivationEnd, NavigationEnd, Router} from '@angular/router';

import {AuthenticationService} from './_services';
import {User, Role} from './_models';
import {TurnService} from "@app/_services/turn.service";
import * as moment from "moment";
import * as io from 'socket.io-client';
import {AddProductionManagerComponent} from "@app/add-production-manager/add-production-manager.component";
import {MatDialog} from "@angular/material/dialog";
import {ProductTurnManagerComponent} from "@app/product-turn-manager/product-turn-manager.component";
import {environment} from "@environments/environment";
import {SettingsService} from "@app/_services/settings.service";
import {MachineService} from './_services/machine.service';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {NotificacionesService} from "@app/_services/notificaciones.service";
import {NotificacionEmergenteComponent} from "@app/notificacion-emergente/notificacion-emergente.component";

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.sass'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        /*   overflow: 'hidden',
           height: '*',*/
        /*  overflow: 'hidden',*/
        width: '80px',
        /*  background:"#919699"*/
      })),
      state('out', style({
        /* opacity: '0',
         overflow: 'hidden',
         height: '0px',
         width: '200px'*/
        width: '300px'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})
export class AppComponent {
  @ViewChild('container', {read: ViewContainerRef})
  container!: ViewContainerRef;
  user: User;
  private socket: any;
  achicado = false
  public static isSticky = true
  public static noMostrarToolbar = false
  public static thingsURL = ""
  userInfo: any;
  actual = ""
  isInMenu = false;
  notifs = false;
  notifsNoLeidas = 0;
  activeTurns = []
  allProductsTurn = []
  productoTurnoActivo: any = ""
  static esAdmin = false;
  static actualStatic = ""
  estadoMenu = "out"
  sideBarWidth: any = "20"

  get issticky() {
    return AppComponent.isSticky
  }

  get isnoMostrarToolbar() {
    return AppComponent.noMostrarToolbar
  }

  get isThingsURL() {
    return AppComponent.thingsURL
  }

  constructor(private turnService: TurnService,
              private router: Router,
              private authenticationService: AuthenticationService,
              private dialog: MatDialog,
              private settingsService: SettingsService,
              private machineService: MachineService,
              private activatedRoute: ActivatedRoute,
              private notificacionesService: NotificacionesService,
              private componentFactoryResolver: ComponentFactoryResolver,
  ) {

    this.socket = io.io(environment.apiUrl);
    if (JSON.parse(localStorage.getItem("user"))) {

      this.socket.emit("registerUserSession", {token: JSON.parse(localStorage.getItem("user")).access_token})
    }

    this.socket.on('notificacionCreada', data => {
      let infoBody = ""

      const dynamicComponentFactory = this.componentFactoryResolver.resolveComponentFactory(NotificacionEmergenteComponent);
      // add the component to the view
      const componentRef = this.container.createComponent(dynamicComponentFactory);
      componentRef.instance.header = data.reqNot.tipoObj.gatillo
      componentRef.instance.tipo = data.reqNot.tipoObj.tipo
      console.log(data);

      if (data.reqNot.idtiposuscripcion == 1)
        infoBody = `${data.reqNot.dataObj.ot.creador} creó una orden de trabajo a las ${moment(data.reqNot.dataObj.ot.horainicio).format("HH:mm")} del dia ${moment(data.reqNot.dataObj.ot.horainicio).format("DD/MM")}.
        en ${data.reqNot.dataObj.ot.idmaquina_maquina.nombre} y tardara ${moment.duration(moment(data.reqNot.dataObj.ot.horainicio).diff(moment(data.reqNot.dataObj.ot.fechafinpredecida))).asHours().toString().split(".")[0]} horas.`

      if (data.reqNot.idtiposuscripcion == 2)
        infoBody = `${data.reqNot.dataObj.ot.quiencomienza} empezó a trabajar en ${data.reqNot.dataObj.ot.nombre} en ${data.reqNot.dataObj.ot.idmaquina_maquina.nombre} a las  ${moment(data.reqNot.dataObj.ot.horainicioaccion).format("HH:mm")} del dia ${moment(data.reqNot.dataObj.ot.horainicioaccion).format("DD/MM")}`
      if (data.reqNot.idtiposuscripcion == 3)
        infoBody = `${data.reqNot.dataObj.ot.quientermina} término la orden de trabajo ${data.reqNot.dataObj.ot.nombre} a las ${moment(data.reqNot.dataObj.ot.horafinconfirmada).format("HH:mm")} `
      if (data.reqNot.idtiposuscripcion == 4)
        infoBody = data.reqNot.info
      if (data.reqNot.idtiposuscripcion == 5)
        infoBody = data.reqNot.info
      if (data.reqNot.idtiposuscripcion == 6)
        infoBody = data.reqNot.info
      if (data.reqNot.idtiposuscripcion == 7)
        infoBody = data.reqNot.info
      if (data.reqNot.idtiposuscripcion == 8)
        infoBody = `${data.reqNot.dataObj.parada.mantencion.quiencreaObj.nombre} ${data.reqNot.dataObj.parada.mantencion.quiencreaObj.apellido} creó una orden de mantenimiento a las ${moment(data.reqNot.dataObj.parada.idinterrupcion_interrupcion.horainicio).format("HH:mm")} del dia ${moment(data.reqNot.dataObj.parada.idinterrupcion_interrupcion.horainicio).format("DD/MM")}.
        en ${data.reqNot.dataObj.parada.idmaquina_maquina.idmaquina_maquina.nombre} y tardara ${moment.duration(moment(moment(data.reqNot.dataObj.parada.idinterrupcion_interrupcion.horainicio).add(data.reqNot.dataObj.parada.idinterrupcion_interrupcion.duracion,"seconds")).diff(data.reqNot.dataObj.parada.idinterrupcion_interrupcion.horainicio)).asHours().toString().split(".")[0]} horas.`
      if (data.reqNot.idtiposuscripcion == 9)
        infoBody = `${data.reqNot.dataObj.parada.mantencion.quienempiezaObj.nombre} ${data.reqNot.dataObj.parada.mantencion.quienempiezaObj.apellido} empezó a trabajar en mantenimiento ${data.reqNot.dataObj.parada.nombre} de ${data.reqNot.dataObj.parada.idmaquina_maquina.idmaquina_maquina.nombre} a las ${moment(data.reqNot.dataObj.parada.mantencion.fecharealizada).format("HH:mm")}`
      if (data.reqNot.idtiposuscripcion == 10)
        infoBody = `${data.reqNot.dataObj.parada.mantencion.quienempiezaObj.nombre} ${data.reqNot.dataObj.parada.mantencion.quienempiezaObj.apellido} término la mantención  ${data.reqNot.dataObj.parada.nombre} de ${data.reqNot.dataObj.parada.idmaquina_maquina.idmaquina_maquina.nombre} a las ${moment(data.reqNot.dataObj.parada.mantencion.fecharealizada).format("HH:mm")}`
      if (data.reqNot.idtiposuscripcion == 11)
        infoBody = data.reqNot.info
      if (data.reqNot.idtiposuscripcion == 12)
        infoBody = data.reqNot.info

      componentRef.instance.body = infoBody

      setTimeout(() => {
        componentRef.destroy()
      }, 10*1000)

      this.notificacionesService.noLeidas()
    })
    this.socket.on('hora', data => {


      if (!(JSON.parse(localStorage.getItem("activeTurn"))?.sensor) && this.isOperator && this.user) {
        this.turnService.getProductTurnByTurn(this.turnService.activeTurnsValue[0].idturno).subscribe(allProductTurnsOfTurn => {
          this.allProductsTurn = allProductTurnsOfTurn
          this.productoTurnoActivo = this.allProductsTurn.find(o => o.activoenturno)


          if (this.productoTurnoActivo) {
            console.log(data);
            let laHoraStr = moment(data).subtract(1, "hour").format("HH")
            let dataModal = {
              prodTurn: this.productoTurnoActivo,
              text: laHoraStr + ":00",
            }

            const dialogRef = this.dialog.open(AddProductionManagerComponent, {
              width: "400px",
              data: dataModal
            })
            dialogRef.afterClosed().subscribe(result => {
              console.log(result);
            });
          }
        })
      }
    });


    this.authenticationService.user.subscribe(x => this.user = x);

    this.turnService.dataActiveTurnsManager.subscribe(pendingTurns => {
      if (pendingTurns) {
//        console.log(pendingTurns);
        this.activeTurns = pendingTurns
      }
    })
    if (!this.isAdmin && !this.isSupervisor) {
      this.turnService.refreshActiveTurns()

    }

  }

  ngOnInit() {

    this.settingsService.getSettings().subscribe((okSett: any) => {
      AppComponent.thingsURL = okSett.thingsboardurl
    })
    this.notificacionesService.dataManager.subscribe(ok => {
      this.notifsNoLeidas = ok
    })
    this.router.events.subscribe((val) => {

      if (val instanceof ActivationEnd) {
        this.actual = val["snapshot"].routeConfig.path
        console.log(this.actual);

        this.actual.includes("datos") ? this.actual = "Configuración empresa" :
          this.actual.includes("proceso") ? this.actual = "Procesos" :
          this.actual.includes("orden-trabajo") ? this.actual = "Ordenes de trabajo" :
          this.actual.includes("interrupciones") ? this.actual = "Paradas" :
          this.actual.includes("empresa") ? this.actual = "Estado de máquinas" :
          this.actual.includes("reportes") ? this.actual = "Analítica" :
            this.actual.includes("maquinas") ? this.actual = "Máquinas" :
              ''
//        console.log(this.actual);
      }
    })
    this.notificacionesService.noLeidas()


  }

  get actualSt() {
    return AppComponent.actualStatic
  }

  bajarWidthSide() {
    setTimeout(() => {

    }, 1000)
  }

  subirWidthSide() {

  }


  achicarMenu() {
    this.achicado = true
    AppComponent.achicadoo = this.achicado
    let intervalo = setInterval(() => {
      if (this.sideBarWidth > 5.5) {
        this.sideBarWidth -= 0.7
      } else {
        clearInterval(intervalo)
        this.estadoMenu = "in"
      }
    }, 10)

  }

  agrandarMenu() {

    let intervalo = setInterval(() => {
      if (this.sideBarWidth < 20) {
        this.sideBarWidth += 0.7
      } else {
        clearInterval(intervalo)
        this.achicado = false
        AppComponent.achicadoo = this.achicado
        this.estadoMenu = "out"
      }
    }, 10)

  }

  toReadableDate(string) {
    let myMoment: moment.Moment = moment(string);
    moment.locale('es');
    myMoment.locale(false);
    //return `${myMoment.format("HH:mm:ss YYYY-MM-DD")}`
    return `${myMoment.format("LLLL")}`

  }

  endTurn(id) {
    this.turnService.end(id).subscribe(ok => {
      console.log(ok);
      this.turnService.refreshActiveTurns()
      this.turnService.dataManagerChangeValue(false)

    })
  }

  static achicadoo = false

  achicar() {
    this.achicado = !this.achicado
    AppComponent.achicadoo = this.achicado
  }

  pintar() {

  }

  format(current) {
    return current.split("/")[0]
  }

  q(d) {
    return Object.keys(d)
  }

  inMenu() {
    this.isInMenu = !this.isInMenu
  }

  get esAdminn() {
    console.log("log");
    return AppComponent.esAdmin
  }

  get isAdmin() {
    return this.user && this.user.role === Role.admin;
  }

  get isOperator() {
    return this.user && this.user.role === Role.operador;
  }

  get isSupervisor() {
    return this.user && this.user.role === Role.supervisor;
  }

  get isActiveTurn() {
    return this.activeTurns.length >= 1
  }

  logout() {
    this.authenticationService.logout();
  }

  ngAfterViewInit(): void {

    this.authenticationService.info().subscribe(x => {
      this.userInfo = x
//      console.log(this.userInfo)

    });

  }


}
