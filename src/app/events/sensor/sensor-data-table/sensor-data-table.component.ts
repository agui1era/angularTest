import {Component, OnInit} from '@angular/core';
import {PlantService} from "@app/_services/plant.service";
import * as moment from "moment";
import Swal from "sweetalert2";
import {Alerts} from "@app/_helpers/alerts";
import {MatDialog} from "@angular/material/dialog";
import {SensorRegisterComponent} from "@app/sensor-register/sensor-register.component";
import {AlertDetentionComponent} from "@app/alert-detention/alert-detention.component";
import {SensorService} from "@app/_services/sensor.service";
import {InfoSensorRegisteredComponent} from "@app/info-sensor-registered/info-sensor-registered.component";

@Component({
  selector: 'app-sensor-data-table',
  templateUrl: './sensor-data-table.component.html',
  styleUrls: ['./sensor-data-table.component.sass']
})
export class SensorDataTableComponent implements OnInit {

  isCatSensor = false
  isLoading = false;
  dataList = []
  dataObject = {}
  subscriptionObject: any = {}
  entityName = "categoria de sensor"
  openAdd = false
  filtro = "nombre"
  keyWord = ""
  vista = "tabla"
  allUnregistered = []
  allRegistered = []


  dataRespaldoList = []

  constructor(
    private service: SensorService,
    private alerts: Alerts,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {

    this.subscriptionObject = this.service.dataTable.subscribe(ok => {
      this.isLoading = true;
      setTimeout(() => {
        if (ok != null) {

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
    this.service.getAllRegistered().subscribe(okRegistered =>{
      this.allRegistered = okRegistered
    })
    this.service.getAllUnregistered().subscribe(okUnregistered =>{
      this.allUnregistered = okUnregistered
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

  openMenuAdd() {
    this.openAdd = !this.openAdd
    if (!this.openAdd) {
      this.service.dataManagerChangeValue(null)
    }
  }

  delete(data) {

    this.alerts.deleteAlert(this.entityName).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(data).subscribe(okk => {
          this.service.refreshDataTable().then(ok => {
            console.log(okk);
            console.log(ok);
          })
        })
      }
    })

  }

  verInfo(data){
    const dialogRef = this.dialog.open(InfoSensorRegisteredComponent, {
      data: {
        data
      }

    }).afterClosed().subscribe(ok => {
      this.service.getAllRegistered().subscribe(okRegistered =>{
        this.allRegistered = okRegistered
      })
      this.service.getAllUnregistered().subscribe(okUnregistered =>{
        this.allUnregistered = okUnregistered
      })
    })
  }

  registrar(data) {
    const dialogRef = this.dialog.open(SensorRegisterComponent, {
      data: {
        data
      }

    }).afterClosed().subscribe(ok => {
      this.service.getAllRegistered().subscribe(okRegistered =>{
        this.allRegistered = okRegistered
      })
      this.service.getAllUnregistered().subscribe(okUnregistered =>{
        this.allUnregistered = okUnregistered
      })
    })
  }

}
