import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TurnService} from "@app/_services/turn.service";
import Swal from "sweetalert2";
import {MachineService} from "@app/_services/machine.service";
import {DOCUMENT} from "@angular/common";
import {ProductTurnManagerComponent} from "@app/product-turn-manager/product-turn-manager.component";
import {MatDialog} from "@angular/material/dialog";
import {Alerts} from "@app/_helpers/alerts";
import {AppComponent} from "@app/app.component";
import {OrdenDeTrabajoService} from '@app/_services/ordenDeTrabajo.service';
import * as io from "socket.io-client";
import {environment} from "@environments/environment";
import {MaintenanceManagerComponent} from "@app/maintenance-manager/maintenance-manager.component";
import {ShowOTComponent} from "@app/show-ot/show-ot.component";
import {element} from "protractor";
import {OrdendeTrabajoManagerComponent} from "@app/ordende-trabajo-manager/ordende-trabajo-manager.component";
import {OrdendetrabajoSumarProdComponent} from "@app/ordendetrabajo-sumar-prod/ordendetrabajo-sumar-prod.component";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as moment from "moment";

@Component({
  selector: 'app-selected-machine',
  templateUrl: './selected-machine.component.html',
  styleUrls: ['./selected-machine.component.sass']
})
export class SelectedMachineComponent implements OnInit {
  elem;
  machineObj: any = {}
  selectedMachineId = ""
  isActiveTurn: any = false;
  isActiveTurnObj: any = {};
  vista = "prod"
  tablaProd = false
  horariosManiana = ["07:00 a 08:00", "08:00 a 09:00", "09:00 a 10:00", "10:00 a 11:00", "11:00 a 12:00", "12:00 a 13:00", "13:00 a 14:00"]
  horariosTarde = ["14:00 a 15:00", "15:00 a 16:00", "16:00 a 17:00", "17:00 a 18:00", "18:00 a 19:00", "19:00 a 20:00", "20:00 a 21:00", "21:00 a 22:00"]
  horariosNoche = ["22:00 a 23:00", "23:00 a 00:00", "00:00 a 01:00", "01:00 a 02:00", "02:00 a 03:00", "03:00 a 04:00", "04:00 a 05:00", "05:00 a 06:00", "06:00 a 07:00"]
  loading = false
  machineProducts = []
  sumHours = 0
  manyProductionsList = []
  displayedColumns: string[] = ['op', 'serie', 'asignado', 'sku', 'nombre', 'cantidadE', 'progreso', 'operador', 'accion', 'ver', 'editar'/*, 'eliminar'*/];
  dataSource = []
  productTurnList = []
  allMachines = []
  selectedEstado: any = "";
  productoTurnoActivo: any = "";
  totalProdPtActivo = 0
  allProductionList: any = []
  allOrdenesDeTrabajo = []
  allOrdenesDeTrabajoResp = []
  initiatedTurn: any = {}
  isInitiatedTurn: any = false
  selectedOrdenDeTrabajo: any = ""
  private socket: any;
  comenzado = false
  selectedSerie = ""
  desde = ""
  hasta = ""
  fechas = []
  allSeries = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: TurnService,
    private service2: MachineService,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: any,
    private alerts: Alerts,
    private ordenDeTrabajoService: OrdenDeTrabajoService
  ) {
    this.socket = io.io(environment.apiUrl);

  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

  horas() {
    let horario = this.service.horarioValue
    //console.log(horario);
    return horario == 'mañana' ?
      this.horariosManiana : horario == 'tarde' ?
        this.horariosTarde : horario == 'noche' ? this.horariosNoche : ''

  }

  selectHorario() {
    Swal.fire({
      title: 'Elige el horario',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Mañana`,
      cancelButtonText: "Tarde",
      denyButtonText: `Noche`,
    }).then((result) => {
      console.log(result);
      if (result.value) {
        console.log("mañana");
        this.service.dataHorarioManagerChangeValue("mañana")
        this.initTurn()
      } else if (!result.value && !result.dismiss) {
        console.log("noche");
        this.service.dataHorarioManagerChangeValue("noche")
        this.initTurn()
      } else if (result.dismiss.toString() == "cancel") {
        console.log("tarde");
        this.service.dataHorarioManagerChangeValue("tarde")
        this.initTurn()
      }

      /* Read more about isConfirmed, isDenied below */
      /* if (result.isConfirmed) {
         Swal.fire('Saved!', '', 'success')
       } else if (result.isDenied) {
         Swal.fire('Changes are not saved', '', 'info')
       }*/
    })
  }

  addProductionList() {
    let productionObj = {
      "horas": {},
      "idproducto": "2",
      "idturno": "1",
      "serie": "",
      "formato": "",
      "condicion": "",
      "idproducto_producto": {
        "id": 0,
      }
    }
    for (let h of this.horas()) {
      let name = h
      productionObj.horas[h] = {
        name,
        cantidad: 0
      }
    }


    this.manyProductionsList.push(productionObj)
  }

  ngOnInit(): void {
    this.elem = document.documentElement;

    this.desde = moment(Date.now()).startOf('day').toDate().toISOString()
    this.hasta = moment(Date.now()).endOf('day').toDate().toISOString()

    this.socket.on("ot", data => {
      this.recargarOT()


    })
    this.socket.on("produccion", data => {
      this.getAllProduction(this.initiatedTurn.id)
      this.recargarOT()

    })
    this.service.dataManager.subscribe(ok => {
      if (ok != undefined) {
        console.log(ok);
        if (ok) {
          this.isActiveTurn = ok
        }
        this.refreshPendingTurn(false)
      }
    })

    this.activatedRoute.paramMap.subscribe((params: any) => {
      console.log(params)
      this.selectedMachineId = params.get('id')
      this.service.getTurnInitiatedByMachine(this.selectedMachineId).subscribe(okTurn => {
        if (okTurn) {
          this.initiatedTurn = okTurn
          this.isInitiatedTurn = true
          this.getProductoTurno(okTurn.id).then(okPt => {
            this.productoTurnoActivo = okPt
            console.log(this.productoTurnoActivo);
            this.getAllProduction(okTurn.id)
          })
          console.log(okTurn);
        }
      })


      this.recargarOT()
      this.service2.getAll().subscribe(ok => {
        this.machineObj = ok.find(o => o.id == this.selectedMachineId)
        this.allMachines = ok
        AppComponent.actualStatic = this.machineObj.nombre
      })

      //   this.refreshPendingTurn(false)

    });


  }

  qwa(){
    console.log("ads")
  }

  finishOT(id) {
    this.ordenDeTrabajoService.finishOT(id).subscribe(ok => {
      console.log(ok);
      this.recargarOT()
    })
  }
  events: string[] = [];

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
  }

  yaComenzadoAlert() {
    this.alerts.generic("No es posible continuar", "Ya existe una orden de trabajo en proceso.", false, "Aceptar")
  }

  sumarProd() {
    this.dialog.open(OrdendetrabajoSumarProdComponent, {
      data: {
        pt: this.productoTurnoActivo,
        listaDetProd:this.allProductionList,
        listaOT: this.allOrdenesDeTrabajo,
        idturno:this.initiatedTurn.id
      },
      height:"80vh",
      width:"70vw"
    }).afterClosed().subscribe(ok => {
      this.recargarOT()
    })
  }
  selectEstado(){
    this.filtrar()
  }
  recargarOT() {
    this.loading = true
    this.ordenDeTrabajoService.getByMaquina(this.selectedMachineId).subscribe(okOrders => {
      this.allSeries = Array.from(new Set(okOrders.map(o => o.codigo)))
      this.allOrdenesDeTrabajo = okOrders
      this.allOrdenesDeTrabajoResp = okOrders
    /*  if (okOrders.find(o => o.estado == 'Comenzado')) {
        this.comenzado = true
        this.filtrar()
      }*/
      if (okOrders.filter(o => o.estado == 'Comenzado').length >=1) {
        this.comenzado = true
        this.filtrar()
      }else{
        this.comenzado = false
        this.filtrar()
      }
      this.service.getTurnInitiatedByMachine(this.selectedMachineId).subscribe(okTurn => {
        if (okTurn) {
          this.initiatedTurn = okTurn
          this.isInitiatedTurn = true
          this.getProductoTurno(okTurn.id).then(okPt => {
            this.productoTurnoActivo = okPt
            console.log(this.productoTurnoActivo);
            this.getAllProduction(okTurn.id)
          })
          console.log(okTurn);
        }
        this.loading = false

      })


    })
  }

  exitTablaProd() {
    console.log("saliir")
    this.service.tablaProdChangeValue(false)
  }
  selectSerie() {
    this.filtrar()
  }
  buscar() {
    this.fechas = []
    if(this.desde && this.hasta){
      this.fechas.push(this.desde)
      this.fechas.push(moment(this.hasta).add(1,"days").toDate().getTime())
    }
    this.filtrar()
  }
  filtrar() {
    this.allOrdenesDeTrabajo = this.allOrdenesDeTrabajoResp
      .filter(o =>
        (this.selectedSerie ? o.codigo == this.selectedSerie : true) &&
        (this.selectedEstado ? o.estado == this.selectedEstado : true) &&
        (this.fechas.length>1  ? new Date(o.horainicio).getTime()  >= new Date(this.fechas[0]).getTime() && new Date(o.horainicio).getTime()  < new Date(this.fechas[1]).getTime()  : true)
      )
    //this.allOrdenesDeTrabajo = [...this.allOrdenesDeTrabajo,...this.allOrdenesDeTrabajoResp.filter(o=>o.horainicio==null)]
  }

  refreshPendingTurn(notEnd) {
    this.service.getPendings().subscribe((pendingsTurn: any) => {
      console.log(pendingsTurn);
      for (let pTurn of pendingsTurn) {
        this.isActiveTurnObj = pTurn;
        this.isActiveTurn = true;
      }
      this.getProductTurn()

      /*   if (notEnd) {
           this.getAllProduction(this.isActiveTurnObj.idturno)
           this.getProductTurn()
         }*/
    })
  }

  cerrarVistaProd() {
    console.log(this.selectedOrdenDeTrabajo);
    this.isActiveTurn = false
    this.service.initOneOT({
      id: this.selectedMachineId,
      idordendetrabajo: this.selectedOrdenDeTrabajo
    }).subscribe(ok => {
      console.log(ok);
      this.recargarOT()
      this.closeFullscreen()

    })


  }

  openCreateMaintenance() {
    this.dialog.open(MaintenanceManagerComponent, {
      data: {operador: true, maquina: this.selectedMachineId}
    }).afterClosed().subscribe(ok => {
      this.recargarOT()
    })
  }

  initTurn() {
    this.loading = true
    this.service.initOne({
      id: this.selectedMachineId,
    }).subscribe(ok => {

      console.log(ok);
      this.service.getPendings().subscribe(okPendgin => {
        this.isActiveTurnObj = okPendgin;
        console.log(okPendgin);
        this.isActiveTurn = true;
        this.service.dataActiveTurnsManagerChangeValue(okPendgin)
        // this.service.getProductTurnByTurn(ok.idturno).subscribe(productTurnsList => {
        /*   console.log(productTurnsList);
           if (productTurnsList.length == 0) {
             const dialogRef = this.dialog.open(ProductTurnManagerComponent, {data: undefined})
           }*/
        this.openFullscreen()
        this.service.refreshActiveTurns()
        console.log(okPendgin);
        this.service.getProductTurnByTurn(ok.id).subscribe(productTurnsList => {
          console.log(productTurnsList);
          this.selectedOrdenDeTrabajo = productTurnsList.find(o => o.activoenturno).idordendetrabajo
          this.productTurnList = productTurnsList

        })
        this.loading = false


        //})
      })
    }, (error: any) => {
      this.alerts.errorAlert(error)
      this.loading = false

    })
  }

  initTurnOT(idordendetrabajo) {
    this.selectedOrdenDeTrabajo = idordendetrabajo
    this.loading = true
    this.service.initOneOT({
      id: this.selectedMachineId,
      idordendetrabajo,
    }).subscribe(ok => {

      console.log(ok);
      this.service.getPendings().subscribe(okPendgin => {
        this.isActiveTurnObj = okPendgin;
        console.log(okPendgin);
        this.isActiveTurn = true;
        this.service.dataActiveTurnsManagerChangeValue(okPendgin)
        // this.service.getProductTurnByTurn(ok.idturno).subscribe(productTurnsList => {
        /*   console.log(productTurnsList);
           if (productTurnsList.length == 0) {
             const dialogRef = this.dialog.open(ProductTurnManagerComponent, {data: undefined})
           }*/
        this.openFullscreen()
        this.service.refreshActiveTurns()
        console.log(okPendgin);
        this.loading = false


        //})
      })
    }, (error: any) => {
      this.alerts.errorAlert(error)
      this.loading = false

    })
  }

  addProduction(hora, cantidad, objprodturn) {
    let data = {
      idprodturn: objprodturn.id,
      hora: hora.substring(0, 5),
      cantidad
    }
    this.service.createProductionByProductTurn(data).subscribe(ok => {
      console.log(ok);

    })
    this.hoursSum(objprodturn)

  }

  verOT(ot) {
    this.dialog.open(ShowOTComponent, {
      data: ot,
      height: "96vh"
    })
  }

  endTurn() {
    this.closeFullscreen()
    this.isActiveTurn = false;
    this.service.end(this.isActiveTurnObj.id).subscribe(ok => {
      this.service.refreshActiveTurns()
      console.log(ok)
      this.refreshPendingTurn(false)
    })
  }

  async getProductoTurno(idTurno) {
    return (await this.service.getProductTurnByTurn(idTurno).toPromise()).find(o => o.activoenturno)
  }

  getProductTurn() {
    if (this.isActiveTurnObj.idturno) {
      this.service.getProductTurnByTurn(this.isActiveTurnObj.idturno).subscribe(productTurnsList => {
        console.log(productTurnsList);
        this.selectedOrdenDeTrabajo = productTurnsList.find(o => o.activoenturno).idordendetrabajo
        this.productTurnList = productTurnsList
        for (let production of productTurnsList) {
          this.getProductionByProductTurn(production.id)

        }
      })
    }


  }

  hoursSum(obj) {
    let value = 0
    for (let h of this.horas()) {
      value += obj.horas ? +obj.horas[h]?.cantidad : 0

    }
    return value
  }

  vistaProd() {
    this.vista = "prod"
  }

  vistaTabla() {
    this.vista = "tabla"

  }

  createProducTurn() {
    let idturno = this.isActiveTurnObj.idturno

    console.log(this.isActiveTurnObj)
    this.service.createProductTurnByTurn({idturno}).subscribe(productTurnCreated => {
      console.log(productTurnCreated);
      this.getProductTurn()
    })

  }

  updateProductTurnSerie(serie, id) {
    this.service.updateProductTurnByTurn({
      id,
      serie
    }).subscribe(ok => {
      console.log(ok);
    })
  }

  updateProductTurnMermas(mermas, id) {
    this.service.updateProductTurnByTurn({
      id,
      mermas
    }).subscribe(ok => {
      console.log(ok);
    })
  }

  updateProductTurnCondicion(condicion, id) {
    this.service.updateProductTurnByTurn({
      id,
      condicion
    }).subscribe(ok => {
      console.log(ok);
    })
  }

  updateProductTurnFormatoUnidad(formatounidad, id) {
    this.service.updateProductTurnByTurn({
      id,
      formatounidad
    }).subscribe(ok => {
      console.log(ok);
    })
  }

  updateProductTurnFormato(formato, id) {
    this.service.updateProductTurnByTurn({
      id,
      formato
    }).subscribe(ok => {
      console.log(ok);
    })
  }

  updateProductTurnProducto(idproducto, id) {
    this.service.updateProductTurnByTurn({
      id,
      idproducto
    }).subscribe(ok => {
      console.log(ok);
      this.getProductTurn()
    })
  }


  getAllProduction(id) {

    this.service.getAllProductionsByTurn(id).subscribe((allProductionList: any) => {
      this.allProductionList = allProductionList.body.data
      this.totalProdPtActivo = this.allProductionList
        .filter(o => o.idprodturn_productoturno?.idordendetrabajo == this.productoTurnoActivo?.idordendetrabajo)
        .map(o => o.cantidad)
        .reduce((a, b) => +a + +b, 0)
    })

  }

  getProductionByProductTurn(id) {
    this.service.getProductionByProductTurn(id).subscribe((productionOfProductTurn:any) => {


      /*    let completeObj = {...distinctObjectProdTurn.idprodturn_productoturno}
          completeObj.horas = {}
          for(let h of this.horas()){
            let name =  h
            completeObj.horas[h] = {
              name,
              cantidad:0
            }
            let existent = ok.find(o=>o.hora == h.substring(0,5) && o.idprodturn_productoturno.idproducto == d)
            if(existent){
              completeObj.horas[h].cantidad = existent.cantidad
            }
          }
          this.manyProductionsList.push(completeObj);
    */
      console.log(productionOfProductTurn);
      console.log(this.productTurnList.find(o => o.id == id));
      for (let i = 0; i < this.productTurnList.length; i++) {
        if (this.productTurnList[i].id == id) {
          console.log("si");
          console.log(i);
          let hours = {}
          for (let h of this.horas()) {
            let name = h
            hours[h] = {
              name,
              cantidad: 0
            }

          }
          for (let hExistent of productionOfProductTurn.data) {
            console.log(hours);
            console.log(hExistent);
            for (let h of Object.keys(hours)) {
              if (h.substring(0, 5) == hExistent.hora) {
                hours[h].cantidad = hExistent.cantidad
              }
            }
          }
          console.log(hours);
          /* console.log(productionOfProductTurn);
           let existent = productionOfProductTurn.find(o => o.hora == h.substring(0, 5))
           if (existent) {
             hours[h].cantidad = existent.cantidad
           }*/
          this.productTurnList[i].horas = hours
          console.log(this.productTurnList);

        }
      }

    })
  }

  terminarReanudarOT(element) {
    Swal.fire({
      title: '¿Deseas reanudar esta orden de trabajo?',
      showDenyButton: true,
      showCancelButton: true,
      cancelButtonText: 'Volver atrás',
      confirmButtonText: 'Reanudar',
      denyButtonText: `Terminar`,
      confirmButtonColor: "green"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.initTurnOT(element.id)
      } else if (result.isDenied) {
        this.finishOT(element.id)
        this.recargarTurno()
      } else {

      }
    })
  }

  recargarTurno() {
    this.service.getTurnInitiatedByMachine(this.selectedMachineId).subscribe(okTurn => {
      if (okTurn) {
        this.initiatedTurn = okTurn
        this.isInitiatedTurn = true
        this.getProductoTurno(okTurn.id).then(okPt => {
          this.productoTurnoActivo = okPt
          console.log(this.productoTurnoActivo);
          this.getAllProduction(okTurn.id)
        })
        console.log(okTurn);
      }
    })
  }

  terminarPausarOT(element) {
    Swal.fire({
      title: '¿Deseas terminar esta orden de trabajo?',
      showDenyButton: true,
      showCancelButton: true,
      cancelButtonText: 'Ir al turno',
      cancelButtonColor:"green",
      confirmButtonText: 'Pausar',
      denyButtonText: `Terminar`,
      confirmButtonColor: "yellow"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let req = {id: element.id, idpt: this.productoTurnoActivo.id}
        console.log(req);
        this.ordenDeTrabajoService.pause(req).subscribe(okPa => {
          this.recargarOT()
          this.recargarTurno()
        })

      } else if (result.isDenied) {
        this.finishOT(element.id)
        this.recargarTurno()

      } else {
        this.initTurn()
      }
    })
  }

  editar(element) {
    const dialogRef = this.dialog.open(OrdendeTrabajoManagerComponent, {data: {maquina: this.selectedMachineId,operador: true,data: element}})
    dialogRef.afterClosed().subscribe(ok => {
      this.recargarOT()
    })
  }

  deleteProductionByProductTurn(id) {
    console.log(id);
    this.service.deleteProductTurn(id).subscribe(ok => {
      console.log(ok);
      this.getProductTurn()
    })
  }

  ngOnDestroy() {
    AppComponent.actualStatic = null
  }

}
