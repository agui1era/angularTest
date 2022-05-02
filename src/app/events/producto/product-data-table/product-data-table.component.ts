import {Component, Input, OnInit} from '@angular/core';
import * as moment from "moment";
import {ProductService} from "@app/_services/product.service";
import Swal from "sweetalert2";
import {Alerts} from "@app/_helpers/alerts";
import {PlanillaDetentionManagerComponent} from "@app/planilla-detention-manager/planilla-detention-manager.component";
import {MatDialog} from "@angular/material/dialog";
import {PlanillaSubproductManagerComponent} from "@app/planilla-subproduct-manager/planilla-subproduct-manager.component";

@Component({
  selector: 'app-product-data-table',
  templateUrl: './product-data-table.component.html',
  styleUrls: ['./product-data-table.component.sass']
})
export class ProductDataTableComponent implements OnInit {
  @Input('preset') preset:any = undefined
  vista = "tabla"
  isLoading = false;
  dataList = []
  dataObject = {}
  subscriptionObject: any = {}
  entityName = "producto"
  openAdd = false
  filtro = "nombre"
  keyWord = ""

  dataRespaldoList = []

  constructor(
    private service: ProductService,
    private alerts: Alerts,
    private dialog:MatDialog
  ) {
  }

  ngOnInit(): void {
    if(this.preset){
      this.enviar(this.preset)
    }
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
    let disallowedFields = ["id", "idproceso", "createdAt", "updatedAt", "idproceso_proceso"]
    return !disallowedFields.find(o => o == field);

  }

  toReadableDate(string) {
    let myMoment: moment.Moment = moment(string);
    moment.locale('es');
    myMoment.locale(false);
    //return `${myMoment.format("HH:mm:ss YYYY-MM-DD")}`
    return `${myMoment.format("LLLL:ss")}`
  }

  openMenuAdd() {
    this.openAdd = !this.openAdd
    if (!this.openAdd) {
      this.service.dataManagerChangeValue(null)
    }
  }

  abrirSubidaMasiva() {
    this.dialog.open(PlanillaSubproductManagerComponent)
  }


  enviar(data) {
    this.openMenuAdd()
    this.service.dataManagerChangeValue(data)
  }

  delete(data) {

    this.alerts.editAlert(this.entityName).then((result) => {
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
