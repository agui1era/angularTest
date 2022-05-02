import {Component, OnInit} from '@angular/core';
import {TurnService} from '@app/_services/turn.service';
import {SubproductService} from "@app/_services/subproduct.service";
import {Alerts} from "@app/_helpers/alerts";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OrdenDeTrabajoService} from "@app/_services/ordenDeTrabajo.service";
import {ShowOTComponent} from "@app/show-ot/show-ot.component";
import {MatDialog} from "@angular/material/dialog";
import {Item, Period, Section, Events, NgxTimeSchedulerService, Text} from 'ngx-time-scheduler-mes-software/';


import {OrdendeTrabajoManagerComponent} from "@app/ordende-trabajo-manager/ordende-trabajo-manager.component";
import * as io from "socket.io-client";
import {environment} from "@environments/environment";
import {PlantService} from "@app/_services/plant.service";
import {ProcessService} from "@app/_services/process.service";
import {MachineService} from "@app/_services/machine.service";
import * as moment from "moment";
import {PlanillaDetentionManagerComponent} from "@app/planilla-detention-manager/planilla-detention-manager.component";
import {PlanillaOrdendetrabajo} from "@app/planilla-ordendetrabajo-manager/planilla-ordendetrabajo-manager.component";
import {QrUserComponent} from "@app/qr-user/qr-user.component";
import {QrOrdendeTrabajoComponent} from "@app/qr-ordende-trabajo/qr-ordende-trabajo.component";

@Component({
  selector: 'app-vista-ot',
  templateUrl: './vista-ot.component.html',
  styleUrls: ['./vista-ot.component.sass']
})
export class VistaOtComponent implements OnInit {
  events: Events = new Events();
  periods: Period[];
  sections: any;
  items: any;

  loading = true
  allProductTurns = []
  allProductTurnsResp = []
  selectedSerie = ""
  selectedEstado = ""
  allSeries = []
  /* displayedColumns = ["serie", "subproducto", "cantidad", "cantidadEsperada", "progreso", "turno", "maquina", "operadores"]
  */
  displayedColumns: string[] = ['HoraFecha', 'ot', 'asignacion', 'codigo', 'SKU', 'cantidad', 'operador', 'cantidada', 'progreso', 'ver', 'editar', 'eliminar', 'qr'];
  textoCalCustom: Text = new Text()
  allSubProductos = []
  listaOt = []
  listaOtResp = []
  desde: any = ""
  hasta: any = ""
  fechas = []
  listaPlants = []
  listaProcesos = []
  listaMaquinas = []
  machSelected = ""
  plantSelected = ""
  procSelected = ""
  listaPlantsResp = []
  listaProcesosResp = []
  listaMaquinasResp = []
  private socket: any;
  vistaCalendario = false

  constructor(
    private service: NgxTimeSchedulerService,
    private plantaService: PlantService,
    private processService: ProcessService,
    private machineService: MachineService,
    private turnService: TurnService,
    private subproductService: SubproductService,
    private alert: Alerts,
    private _snackBar: MatSnackBar,
    private ordenDeTrabajoService: OrdenDeTrabajoService,
    private dialog: MatDialog
  ) {
    this.socket = io.io(environment.apiUrl);

  }

  ngOnInit(): void {
    this.desde = moment().format("YYYY-MM-DD")
    this.hasta = moment().add(1, "d").format("YYYY-MM-DD")
    this.textoCalCustom.SectionTitle = "Orden de trabajo"
    this.textoCalCustom.GotoButton = "Ir a"
    this.textoCalCustom.NextButton = "Siguiente"
    this.textoCalCustom.PrevButton = "Anterior"
    this.textoCalCustom.TodayButton = "Hoy"
    this.events.SectionClickEvent = (section: any) => {
      console.log(section);
      this.verOT(section.dataOt)
    };
    this.events.ItemClicked = (item: any) => {
      console.log(item);
      this.verOT(item.dataOt)

    };
    this.events.ItemDropped = (item) => {
      console.log(item);
    };
    this.events.PeriodChange = (start, end) => {
      this.recargaOtService()
    };

    this.periods = [
      {
        name: 'Día',
        timeFramePeriod: (30),
        timeFrameOverall: (60 * 24),
        timeFrameHeaders: [
          'Do MMM',
          'HH'
        ],/*        timeFrameHeaders: [
          'Do MMM',
          'HH'
        ],*/
        classes: ''
      }, {
        name: 'Semana',
        timeFrameHeaders: ['MMM YYYY', 'DD(ddd)'],
        classes: '',
        timeFrameOverall: 1440 * 7,
        timeFramePeriod: 1440,
      }, {
        name: 'Mes',
        timeFrameHeaders: ['MMM YYYY', 'DD'],
        classes: '',
        timeFrameOverall: 10080 * 4,
        timeFramePeriod: 10080,
      }];
    this.sections = [{
      name: 'E4',
      id: -1
    },];

    this.items = [{
      id: 4,
      sectionID: 4,
      name: 'Item 1',
      start: moment().startOf('day'),
      end: moment().add(5, 'days').endOf('day'),
      classes: ''
    }, {
      id: 5,
      sectionID: 5,
      name: 'Item 2',
      start: moment().startOf('day'),
      end: moment().hours(5).minutes(30),
      classes: ''
    }];
    this.subproductService.getAll().subscribe(oksp => {
      this.allSubProductos = oksp
    })
    this.plantaService.getAll().subscribe(okPlants => {
      this.listaPlants = okPlants
      this.listaPlantsResp = okPlants
    })
    this.processService.getAll().subscribe(okPlants => {
      this.listaProcesos = okPlants
      this.listaProcesosResp = okPlants
    })
    this.machineService.getAll().subscribe(okPlants => {
      this.listaMaquinas = okPlants
      this.listaMaquinasResp = okPlants
    })
    /* this.desde = moment(Date.now()).startOf('day').toDate().toISOString()
     this.hasta = moment(Date.now()).endOf('day').toDate().toISOString()
 */
    this.ordenDeTrabajoService.dataTable.subscribe(okOT => {

      if (okOT) {
        this.listaOt = okOT
        this.listaOtResp = okOT
        this.allSeries = Array.from(new Set(okOT.map(o => o.codigo)))
        this.items = this.listaOt.map(o => {
            let cc = 0
            cc += 1
            return {
              id: cc,
              dataOt: o,
              sectionID: o.id,
              name: o.nombre,
              cstyles: {'background-color': 'green'},
              start: moment(o.horainicio),
              end: moment(o.horafinpredecida),
              classes: '.rojo'
            }
          }
        )
        this.filtrar()
        this.buscar()

        /*  this.sections = this.listaOt.map(o => {
            return {
              dataOt: o,
              name: o.nombre + " progreso esperado",
              id: o.id
            }
          })
          this.sections.sort((a, b) => b.name.localeCompare(a.name))
  */

      }


      this.loading = false
    })

    this.socket.on("ot", data => {
      this.recargaOtService()

    })
    /*this.turnService.getAllProductTurns().subscribe(okPt => {
      this.allProductTurns = okPt
      this.allProductTurns = this.allProductTurns.map(o => {
        return {
          ...o,
          totaltotal: o.detproduccions.map(oo => oo.cantidad).filter(o => !isNaN(o)).reduce((a, b) => +a + +b, 0)
        }
      })
      this.allProductTurnsResp = this.allProductTurns
      console.log(this.allProductTurns);
      this.allSeries = Array.from(new Set(this.allProductTurns.map(o => o.serie)))

    })*/
    this.loading = false
    this.recargaOtService().then(ok => {

    })
  }

  recargaOtService() {
    this.loading = true
    return this.ordenDeTrabajoService.refreshDataTable()

  }


  buscar() {
    this.fechas = []
    if (this.desde && this.hasta) {
      this.fechas.push(this.desde)
      this.fechas.push(moment(this.hasta).add(1, "days").toDate().getTime())
    }
    this.filtrar()
  }

  filtrar() {
    this.listaOt = this.listaOtResp
      .filter(o => (this.plantSelected ? o.idplanta == this.plantSelected : true) &&
        (this.procSelected ? o.idproceso == this.procSelected : true) &&
        (this.machSelected ? o.idmaquina == this.machSelected : true) &&
        (this.selectedEstado ? o.estado == this.selectedEstado : true) &&
        (this.selectedSerie ? o.codigo == this.selectedSerie : true) &&
        (this.fechas.length > 1 ? new Date(o.horainicio).getTime() >= new Date(this.fechas[0]).getTime() && new Date(o.horainicio).getTime() < new Date(this.fechas[1]).getTime() : true)
      )
    let cc = 0
    if (this.listaOt.length > 0) {
      this.service.sectionPush({id: -1, name: "ola"})
      this.service.sectionRemove(-1)
      this.sections = this.listaOt.map(o => {
        return {
          dataOt: o,
          name: o.nombre + " progreso esperado",
          id: o.id
        }
      })
      this.sections.push(...this.listaOt.map(o => {
        return {
          dataOt: o,
          name: o.nombre + " progreso actual",
          id: o.id + "p"
        }
      }))
      this.sections.sort((a, b) => b.name.localeCompare(a.name))

      this.items = this.listaOt.map(o => {
          let cc = 0
          cc += 1
          return {
            id: cc,
            dataOt: o,
            sectionID: o.id,
            name: 'ESPERADO ' + o.nombre,
            start: moment(o.horainicio),
            end: moment(o.horafinpredecida),
            classes: '.rojo'
          }
        }
      )
      this.items.push(...this.listaOt.map(o => {
          cc += 1
          return {
            id: cc,
            dataOt: o,
            sectionID: o.id + "p",
            name: 'ACTUAL ' + o.nombre,
            cstyles: {'background-color': 'green'},
            start: moment(o.horainicioaccion),
            end: moment(o.horafinconfirmada ? o.horafinconfirmada :
              o.horafincorte ? o.horafincorte : Date.now()),
            classes: ''
          }
        }
      ))
      /*  this.sections.push(...this.listaOt.map(o => {
          return {
            dataOt: o,
            name: o.nombre +" progreso actual",
            id: o.id+"p"
          }
        }))*/

      /* this.items.push(...this.listaOt.map(o => {
           cc += 1
           return {
             id: cc,
             dataOt: o,
             sectionID: o.id+"p",
             name: o.nombre,
             start: moment(o.horainicio),
             end: moment(o.horafinpredecida),
             classes: ''
           }
         }
       ))*/

      /*this.sections.push({
        name: 'A',
        id: 1
      })*/
      /*

              this.sections = this.listaOt.map(o => {
                return {
                  dataOt: o,
                  name: o.nombre + " progreso esperado",
                  id: o.id
                }
              })
             this.sections.sort((a, b) => b.name.localeCompare(a.name))
      */


      /*      for (let oo of this.listaOt.map(o => {
              return {
                dataOt: o,
                name: o.nombre + " progreso esperado",
                id: o.id
              }
            }).sort((a, b) => b.name.localeCompare(a.name))) {
              this.service.sectionPush(oo)
            }
            for (let ot of this.listaOt) {
              console.log("agregando");
              this.addItem({
                id: cc,
                dataOt: ot,
                sectionID: ot.id,
                name: ot.nombre,
                cstyles: {'background-color': 'green'},
                start: moment(ot.horainicio),
                end: moment(ot.horafinpredecida),
                classes: '.rojo'
              })
              cc += 1
            }*/

      /* if (this.items?.length > 0) {
         console.log('zntodo');
         this.popAllItems()
         console.log('todo');


         this.items = this.listaOt.map(o => {
             let cc = 0
             cc += 1
             return {
               id: cc,
               dataOt: o,
               sectionID: o.id,
               name: o.nombre,
               cstyles: {'background-color': 'green'},
               start: moment(o.horainicio),
               end: moment(o.horafinpredecida),
               classes: '.rojo'
             }
           }
         )
       }*/
      /*  for (let ot of this.listaOt) {
          console.log("agregando");
           this.addItem({
             id: cc,
             dataOt: ot,
             sectionID: ot.id,
             name: ot.nombre,
             cstyles: {'background-color': 'green'},
             start: moment(ot.horainicio),
             end: moment(ot.horafinpredecida),
             classes: '.rojo'
           })
          cc += 1
        }*/


    }


    /*for(let ot of this.listaOt){
      this.addItem({
        id: cc,
        dataOt: ot,
        sectionID: ot.id,
        name: ot.nombre,
        cstyles: {'background-color': 'green'},
        start: moment(ot.horainicio),
        end: moment(ot.horafinpredecida),
        classes: '.rojo'
      })
      cc += 1
    }*/
    /*this.items = this.listaOt.map(o => {
        cc += 1
        return {
          id: cc,
          dataOt: o,
          sectionID: o.id,
          name: o.nombre,
          cstyles: {'background-color': 'green'},
          start: moment(o.horainicio),
          end: moment(o.horafinpredecida),
          classes: '.rojo'
        }
      }
    )*/
    //this.listaOt = [...this.listaOt,...this.listaOtResp.filter(o=>o.horainicio==null)]
  }

  agregarNuevo() {
    /* this.service.itemPush({
       id: 1,
       sectionID: 1,
       name: "ot.nombre",
       cstyles: {'background-color': 'green'},
       start: moment(),
       end: moment(),
       classes: '.rojo'
     })*/
    this.addItem({})
  }

  selectEstado() {
    this.filtrar()
  }

  eliminarItems() {
    let ccE = 0
    for (let ot of this.listaOt) {
      try {
        this.removeItem(ccE)
      } catch (e) {

      }
      ccE += 1
    }
  }

  popSection() {
    this.service.sectionPop()
  }

  addSection() {
    this.service.sectionPush({
      name: 'E!',
      id: 1
    })
  }

  popAllItems() {

    for (let ot of this.listaOt) {
      try {
        this.popItem()
      } catch (e) {

      }
    }
  }

  OpenQROT(ot) {
    this.dialog.open(QrOrdendeTrabajoComponent, {
      data: {ot},
      width: "500px",
      height: "710px"
    })
  }

  addItem(itm) {
    /*this.service.itemPush(itm)*/
    this.service.itemPush({
      id: 4,
      sectionID: 2,
      name: 'Item 4',
      start: moment().startOf('day'),
      end: moment().add(3, 'days').endOf('day'),
      classes: ''
    });
  }

  popItem() {
    this.service.itemPop();
  }

  removeItem(id) {
    this.service.itemRemove(id);
  }

  abrirSubidaMasiva() {
    this.dialog.open(PlanillaOrdendetrabajo)
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'cerrar', {duration: 1700});
  }

  recargarOT() {
    this.loading = true
    this.ordenDeTrabajoService.getAll().subscribe(okOrders => {
      this.loading = false
      this.listaOt = okOrders
    })
  }

  selecPlanta() {
    console.log(this.plantSelected);
    console.log(this.listaProcesos.filter(o => o.idplanta == this.plantSelected))
    this.listaProcesos = this.listaProcesosResp.filter(o => o.idplanta == this.plantSelected)
    this.procSelected = ""
    this.filtrar()
  }

  selecProcess() {
    console.log(this.procSelected);
    this.listaMaquinas = this.listaMaquinasResp.filter(o => o.idproceso == this.procSelected)
    this.machSelected = ""
    this.filtrar()

  }

  verOT(ot) {
    console.log("AAA");
    this.dialog.open(ShowOTComponent, {
      data: ot,
      height: "96vh"
    })
  }

  cambiarSp(sp) {
    if (sp != '') {
      let idSpSelected = sp.idsubproducto_subproducto.id
      let productTurnId = sp.id
      this.alert.editAlert("Sub producto").then(ok => {
        if (ok.isConfirmed) {
          let req = {
            id: productTurnId,
            idsubproducto: idSpSelected
          }
          this.turnService.updateProductTurnByTurn(req).subscribe(spEdited => {
            console.log(spEdited);
            this.openSnackBar("Subproducto editado correctamente!")

          })
        } else {
          sp.idsubproducto_subproducto.id = parseInt(sp.idsubproducto)
        }
      })
      console.log(sp);
    }
  }

  editar(element) {
    const dialogRef = this.dialog.open(OrdendeTrabajoManagerComponent, {data: {data: element}})
    dialogRef.afterClosed().subscribe(ok => {
      this.recargaOtService()

    })
  }

  openOtManager() {
    const dialogRef = this.dialog.open(OrdendeTrabajoManagerComponent)
    dialogRef.afterClosed().subscribe(ok => {
      this.recargaOtService()

    })
  }

  eliminarOT(id) {
    this.ordenDeTrabajoService.delete(id)
      .subscribe(okDEL => {
        console.log(okDEL);
        this.recargaOtService()


      })
  }

  selectSerie() {
    this.filtrar()
  }

}
