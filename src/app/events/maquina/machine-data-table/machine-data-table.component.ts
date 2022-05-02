import {Component, OnInit} from '@angular/core';
import {ProductService} from "@app/_services/product.service";
import * as moment from "moment";
import {MachineService} from "@app/_services/machine.service";
import {ProcessService} from "@app/_services/process.service";
import Swal from "sweetalert2";
import {Alerts} from "@app/_helpers/alerts";
import {QrUserComponent} from "@app/qr-user/qr-user.component";
import { QrMaquinaComponent } from '@app/qr-maquina/qr-maquina.component';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-machine-data-table',
  templateUrl: './machine-data-table.component.html',
  styleUrls: ['./machine-data-table.component.sass']
})
export class MachineDataTableComponent implements OnInit {


  isLoading = false;
  dataList = []
  dataObject = {}
  subscriptionObject: any = {}
  entityName = "maquina"
  openAdd = false
  filtro = "nombre"
  keyWord = ""
  vista = "tabla"

  dataRespaldoList = []

  constructor(
    private service: MachineService,
    private alerts: Alerts,
    private dialog:MatDialog
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
  }

  ngOnDestroy(): void {
    this.subscriptionObject.unsubscribe()
  }
  changeHide(val) {
    console.log(val);
    if (val == "ocultar") {
      this.alerts
        .successFullAlert("Operacion realizada exitosamente").then(ok=>{
        this.openAdd = false
        this.service.dataManagerChangeValue(null)

      })


    }
  }
  OpenQRMaq(maq){
    this.dialog.open(QrMaquinaComponent,{
      data:{maq},
      width:"1050px",
      height:"670px"
    })
  }
  busqueda() {
    let resume = this.dataRespaldoList.filter(o=>{
      return this.filtro  == 'proceso' ? o.idproceso_proceso.nombre?.includes(this.keyWord || '') : this.filtro == 'planta' ? o.idproceso_proceso.idplanta_plantum.nombre?.includes(this.keyWord || '') : o[this.filtro]?.includes(this.keyWord || '')
    })
    this.dataList = resume
  }
  limpiarFiltros(){
    this.keyWord = ""
    this.dataList = this.dataRespaldoList
  }

  keys() {
    return Object.keys(this.dataObject)
  }
  showField(field){
    let disallowedFields = ["id","idproceso","createdAt","updatedAt","idproceso_proceso"]
    return !disallowedFields.find(o=>o==field);

  }
  toReadableDate(string) {
    let myMoment: moment.Moment = moment(string);
    moment.locale('es');
    myMoment.locale(false);
    //return `${myMoment.format("HH:mm:ss YYYY-MM-DD")}`
    return `${myMoment.format("LLLL:ss")}`
  }
  openMenuAdd(){
    this.openAdd = !this.openAdd
    if(!this.openAdd){
      this.service.dataManagerChangeValue(null)
    }
  }

  enviar(data) {
    this.openMenuAdd()
    console.log(data);
    this.service.dataManagerChangeValue(data)
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

}
