import {Component, OnInit} from '@angular/core';
import {UserService} from '@app/_services/user.service'
import * as moment from 'moment';
import Swal from 'sweetalert2'
import {Alerts} from "@app/_helpers/alerts";
import {MatDialog} from "@angular/material/dialog";
import {QrUserComponent} from '@app/qr-user/qr-user.component';
import {NotifySuscriptionsManagerComponent} from "@app/notify-suscriptions-manager/notify-suscriptions-manager.component";
import {Role, User} from "@app/_models";
import {AuthenticationService} from "@app/_services";
import {GrupoNotManagerComponent} from "@app/grupo-not-manager/grupo-not-manager.component";

@Component({
  selector: 'app-user-data-table',
  templateUrl: './user-data-table.component.html',
  styleUrls: ['./user-data-table.component.sass']
})
export class UserDataTableComponent implements OnInit {
  isLoading = false;
  dataList = []
  dataObject = {}
  subscriptionObject: any = {}
  entityName = "usuario"
  openAdd = false
  filtro = "nombre"
  keyWord = ""
  vista = "tabla"
  user: User;

  dataRespaldoList = []

  constructor(
    private service: UserService,
    private alerts: Alerts,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
  ) {

  }

  openMenuAdd() {
    this.openAdd = !this.openAdd
    if (!this.openAdd) {
      this.service.dataManagerChangeValue(null)
    }
  }

  ngOnInit(): void {

    this.authenticationService.user.subscribe(x => this.user = x);

    this.subscriptionObject = this.service.dataTable.subscribe(ok => {
      this.isLoading = true;
      setTimeout(() => {
        if (ok != null) {
          console.log(ok);
          this.dataObject = ok.length >= 1 ? ok[0] : {}
          this.dataList = ok
          this.dataRespaldoList = ok

        }
        this.isLoading = false;

      }, 100)
      console.log(this.dataList);
    })
    this.service.refreshDataTable().then(refrescado => {
      console.log(refrescado);
    })

  }

  openGrupoNot() {
    this.dialog.open(GrupoNotManagerComponent, {
      width: "60vw",
      height: "70vh"
    }).afterClosed().subscribe(ok => {

    })
  }

  changeHide(val) {
    console.log(val);
    if (val == "ocultar") {
      this.alerts
        .successFullAlert("Operacion realizada exitosamente").then(ok => {
        this.openAdd = false
        this.service.dataManagerChangeValue(null)

      })


    }
  }

  get isOperator() {
    return this.user && this.user.role === Role.operador;
  }

  OpenQRUser(usr) {
    this.dialog.open(QrUserComponent, {
      data: {usr},
      width: "321px",
      height: "204px"/*
      width:"8.5cm",
      height:"5.4cm"*/
    })
  }

  notifiesUser(usr) {
    this.dialog.open(NotifySuscriptionsManagerComponent, {
      data: {usr},
      width: "60vw",
      height: "70vh"
    })
  }

  busqueda() {

    let resume = this.dataRespaldoList.filter(o => {
      return o[this.filtro]?.includes(this.keyWord || '')
    })
    this.dataList = resume
  }

  limpiarFiltros() {
    this.keyWord = ""
    this.dataList = this.dataRespaldoList
  }

  ngOnDestroy(): void {
    this.subscriptionObject.unsubscribe()
  }

  keys() {
    return Object.keys(this.dataObject)
  }

  showField(field) {
    let disallowedFields = ["id", "foto", "createdAt", "updatedAt", "idproceso_proceso"]
    return !disallowedFields.find(o => o == field);

  }

  toReadableDate(string) {
    let myMoment: moment.Moment = moment(string);
    moment.locale('es');
    myMoment.locale(false);
    //return `${myMoment.format("HH:mm:ss YYYY-MM-DD")}`
    return `${myMoment.format("LLLL:ss")}`
  }

  enviar(data) {
    this.openMenuAdd()
    this.service.dataManagerChangeValue(data)
  }


  delete(user) {

    this.alerts.deleteAlert(this.entityName).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(user).subscribe(okk => {
          this.service.refreshDataTable().then(ok => {
            console.log(okk);
            console.log(ok);
          })
        })
        /*        Swal.fire(
                  'Usuario eliminado',
                  'success'
                )*/
      }
    })
  }

  recovery(data) {
    console.log(data);
    this.service.recovery(data).subscribe(ok => {
      console.log(ok);
    })

  }

}
