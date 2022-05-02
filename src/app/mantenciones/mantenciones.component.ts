import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MaintenanceService} from "@app/_services/maintenance.service";
import {TurnService} from "@app/_services/turn.service";
import {MatDialog} from "@angular/material/dialog";
import {InventoryMaintenanceManagerComponent} from "@app/inventory-maintenance-manager/inventory-maintenance-manager.component";
import {CategoryDetentionService} from "@app/_services/categoryDetention.service";
import {MachineService} from "@app/_services/machine.service";
import {InterruptionService} from "@app/_services/interruption.service";
import {MaintenanceManagerComponent} from "@app/maintenance-manager/maintenance-manager.component";
import * as moment from "moment";
import {DetentionService} from "@app/_services/detention.service";
import {Alerts} from "@app/_helpers/alerts";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OrdenDeTrabajoService} from '@app/_services/ordenDeTrabajo.service';
import Swal from "sweetalert2";
import {SelectAlertDetentionComponent} from "@app/select-alert-detention/select-alert-detention.component";
import {VerMantencionComponent} from "@app/ver-mantencion/ver-mantencion.component";
import {PlantService} from "@app/_services/plant.service";
import {ProcessService} from '@app/_services/process.service';
import {QrOrdendeTrabajoComponent} from "@app/qr-ordende-trabajo/qr-ordende-trabajo.component";
import {QrMantencionesComponent} from "@app/qr-mantenciones/qr-mantenciones.component";
import {Events, NgxTimeSchedulerService, Period, Text} from "ngx-time-scheduler-mes-software";

export interface PeriodicElement {

}

@Component({
  selector: 'app-mantenciones',
  templateUrl: './mantenciones.component.html',
  styleUrls: ['./mantenciones.component.sass']
})


export class MantencionesComponent implements OnInit {
  events: Events = new Events();
  periods: Period[];
  sections: any;
  items: any;
  textoCalCustom: Text = new Text()


  openMaintenance = false
  editing = false
  maintenanceList = []
  listaOt = []
  allCategoryDetentions = []
  allDetentions = []
  desde = ""
  hasta = ""
  fechas = []
  vistaCalendario = false
  listaPlants = []
  listaProcesos = []
  listaMaquinas = []
  machSelected = ""
  plantSelected = ""
  procSelected = ""
  listaPlantsResp = []
  listaProcesosResp = []
  listaMaquinasResp = []
  maintenanceListResp = []
  dataSource: any = {}
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  filtrosGroup: FormGroup = new FormGroup({
    planta: new FormControl('',),
    categoria: new FormControl('',),
    proceso: new FormControl({value: '', disabled: false}),
    turno: new FormControl('',),
    maquina: new FormControl({value: '', disabled: false}, Validators.required),
    dia: new FormControl('',),

  })
  newInterruption: any = {
    comentario: "",
    horainicio: "",
    duracion: ""
  }

  allDetentionsBySelectedCatDet = []
  selectedCategoryDetention = ""
  allMachineList = []
  /*
    displayedColumns: string[] = ['ot', 'codigo', 'asignacion', 'SKU', 'cantidad', 'HoraFecha', 'editar', 'eliminar'];
  */


  displayedColumns: string[] = ['horaInicio', 'nombre', 'tiempoprogramado', 'fechaprogramada', 'fecharealizadainicio', 'maquina', 'mantencion',
    "comentario", 'ver', 'Editar', 'empezarterminar',
    'Eliminar', 'qr'];


  constructor(
    private service: NgxTimeSchedulerService,
    private maintenanceService: MaintenanceService,
    private turnService: TurnService,
    private dialog: MatDialog,
    private categoryDetentionsService: CategoryDetentionService,
    private machineService: MachineService,
    private detentionService: DetentionService,
    private interruptionService: InterruptionService,
    private alerts: Alerts,
    private ordenDeTrabajoService: OrdenDeTrabajoService,
    private plantService: PlantService,
    private processService: ProcessService
  ) {
  }

  openInventoryMenu(obj) {
    console.log(obj);
    if (obj.activo) {
      obj.activo = false
      this.hacerDscto(obj)
    }
    this.dialog.open(InventoryMaintenanceManagerComponent, {
      data: {
        create: true,
        detention: obj.idinterrupcion_interrupcion.tipo_parada
      }
    })
  }

  openCreateMaintenance() {
    this.dialog.open(MaintenanceManagerComponent, {
      data: {operador: false}
    }).afterClosed().subscribe(ok => {
      this.maintenanceService.refreshDataTable()
    })
  }

  openEditMaintenance(element) {
    this.dialog.open(MaintenanceManagerComponent, {
      data: {operador: false, element}
    }).afterClosed().subscribe(ok => {
      this.maintenanceService.refreshDataTable()

    })
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    /*   this.paginator._intl.itemsPerPageLabel = "Registros por página";
       this.paginator._intl.nextPageLabel = "Página siguiente"
       this.paginator._intl.previousPageLabel = "Página anterior"
       this.paginator._intl.lastPageLabel = "Última página"
       this.paginator._intl.firstPageLabel = "Primera página"
   */
    this.textoCalCustom.SectionTitle = "Mantenimiento"
    this.textoCalCustom.GotoButton = "Ir a"
    this.textoCalCustom.NextButton = "Siguiente"
    this.textoCalCustom.PrevButton = "Anterior"
    this.textoCalCustom.TodayButton = "Hoy"
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
    /*this.sections = []
    this.items = []*/
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
    this.ordenDeTrabajoService.dataTable.subscribe(okOT => {
      if (okOT) {
        this.listaOt = okOT
      }

    })
    this.detentionService.getAll().subscribe(okDetentions => {
      this.allDetentions = okDetentions.filter(o => o.idcategoriaparada == 1 && o.idmaqrel == null)

      console.log(this.allDetentions);
    })

    this.plantService.getAll().subscribe(okPlants => {
      this.listaPlants = okPlants
      this.listaPlantsResp = okPlants
    })
    this.processService.getAll().subscribe(okPlants => {
      this.listaProcesos = okPlants
      this.listaProcesosResp = okPlants
    })
    this.machineService.getAll().subscribe(okMachines => {
      this.allMachineList = okMachines
      this.listaMaquinas = okMachines
      this.listaMaquinasResp = okMachines
      this.maintenanceService.dataTable.subscribe(ok => {
        if (ok != undefined) {
          this.maintenanceList = ok.map(o => {
            let paradamaquinas = o.idinterrupcion_interrupcion.tipo_parada.paradamaquinas.map(oo => {
              return {
                ...oo,
                machineData: this.allMachineList.find(m => m.id == oo.idmaquin)
              }
            })
            let newO = {...o}
            newO.idinterrupcion_interrupcion.tipo_parada.paradamaquinas = paradamaquinas
            newO.fechaprogramadaDisplay = moment(o.fechaprogramada).format("HH:mm")
            //newO.fechaprogramadaDisplay = moment(o.fechaprogramada).format("yyyy-MM-DDTHH:mm")
            console.log(newO.fechaprogramadaDisplay);
            console.log(newO);
            newO.duracionCalculo = newO.idinterrupcion_interrupcion.duracion / 60
            if (newO.fecharealizadafin) {

              var startTime = moment(newO.fecharealizada);
              var endTime = moment(newO.fecharealizadafin);

              let difInSecs = endTime.diff(startTime, 'seconds')
              newO.duracionRealCalculo = (difInSecs / 60).toFixed(2)
            }

            return newO

          })
          this.dataSource = new MatTableDataSource<PeriodicElement>(this.maintenanceList);
          this.maintenanceListResp = this.maintenanceList
          console.log(this.maintenanceList);
          this.filtrar()
        }
      })
    })

    this.categoryDetentionsService.dataTable.subscribe(categoryDetentionsAll => {
      if (categoryDetentionsAll) {
        console.log(categoryDetentionsAll);
        this.allCategoryDetentions = categoryDetentionsAll.filter(o => o.tipo != "no programada")
      }
    })
    this.categoryDetentionsService.refreshDataTable()
    this.ordenDeTrabajoService.refreshDataTable()
    this.maintenanceService.refreshDataTable()

  }

  limpiar() {

  }

  selecPlanta() {
    console.log(this.plantSelected);
    console.log(this.listaProcesos.filter(o => o.idplanta == this.plantSelected))
    this.listaProcesos = this.listaProcesosResp.filter(o => o.idplanta == this.plantSelected)
    this.procSelected = ""
    this.filtrar()
  }

  OpenQROT(mant) {
    this.dialog.open(QrMantencionesComponent, {
      data: {mant},
      width: "500px",
      height: "710px"
    })
  }

  selecProcess() {
    console.log(this.procSelected);
    this.listaMaquinas = this.listaMaquinasResp.filter(o => o.idproceso == this.procSelected)
    this.machSelected = ""
    this.filtrar()
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
    this.dataSource = this.maintenanceListResp
      .filter(o => (this.plantSelected ? o.idinterrupcion_interrupcion.tipo_parada.paradamaquinas[0].machineData.idproceso_proceso.idplanta_plantum.id == this.plantSelected : true) &&
        (this.procSelected ? o.idinterrupcion_interrupcion.tipo_parada.paradamaquinas[0].machineData.idproceso_proceso.id == this.procSelected : true) &&
        (this.machSelected ? o.idinterrupcion_interrupcion.tipo_parada.paradamaquinas[0].machineData.id == this.machSelected : true) &&
        (this.fechas.length > 1 ? new Date(o.fechaprogramada).getTime() >= new Date(this.fechas[0]).getTime() && new Date(o.fechaprogramada).getTime() < new Date(this.fechas[1]).getTime() : true)
      )
    let cc = 0


    if (this.dataSource.length > 0) {
       this.service.sectionPush({id: -1, name: "ola"})
       this.service.sectionRemove(-1)
      this.sections = this.dataSource.map(o => {
        return {
          dataOt: o,
          name: o.nombre,
          id: o.id
        }
      })
      this.sections.sort((a, b) => b.name.localeCompare(a.name))
      this.items = this.dataSource.map(o => {

        let cc = 0
          cc += 1
          return {
            id: cc,
            dataOt: o,
            sectionID: o.id,
            name: o.nombre,
            start: moment(o.fechaprogramada),
            end: moment(moment(o.fechaprogramada).add(o.idinterrupcion_interrupcion.duracion, "seconds").toDate().getTime()),
            classes: 'mant'
          }
        }
      )
      this.items.push(...this.dataSource.map(o => {
        cc += 1
        if (o.fecharealizada) {
          return {
            id: cc,
            dataOt: o,
            sectionID: o.id + "p",
            name: 'ACTUAL ' + o.nombre,
            cstyles: {'background-color': 'green'},
            start: moment(o.fecharealizada),
            end: moment(o.fecharealizadafin ? o.fecharealizadafin:Date.now()),
            classes: ''
          }
        }else{
          return false
        }
      }).filter(o=>o))
    }


  }


  crear() {
    this.newInterruption.horainicio = new Date(this.newInterruption.horainicio).getTime()
    console.log(this.newInterruption);

    this.interruptionService.create(this.newInterruption).subscribe(okInterruption => {
      console.log(okInterruption);
      this.maintenanceService.create({
        "idinterrupcion": okInterruption.id,
        "fechaprogramada": this.newInterruption.horainicio
      }).subscribe(okMaintenance => {
        console.log(okMaintenance);
        this.maintenanceService.refreshDataTable()
      })
    })


  }

  cancel() {
    this.machineService.refreshDataTable()
  }


  pauseOT(id) {

  }

  ver(element) {
    const dialogRef = this.dialog.open(VerMantencionComponent,
      {
        data: {
          element
        }
      })
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  initOT(id) {
    this.ordenDeTrabajoService.init({id}).subscribe(okInitOT => {
      this.ordenDeTrabajoService.refreshDataTable()
    })
  }


  init(element) {
    this.maintenanceService.init(element.id).subscribe((ok: any) => {
      console.log(ok);
      //    this.maintenanceService.refreshDataTable()
      if (element.fecharealizada) {
        element.fecharealizadafin = ok.fecha

        var startTime = moment(element.fecharealizada);
        var endTime = moment(element.fecharealizadafin);

        let difInSecs = endTime.diff(startTime, 'seconds')
        element.duracionRealCalculo = (difInSecs / 60).toFixed(2)

      } else {
        element.fecharealizada = ok.fecha

      }

    })
  }

  hacerDscto(suitch) {
    console.log(suitch);


    let req = {
      idparada: suitch.idinterrupcion_interrupcion.tipo_parada.id,
      id: suitch.id,
      activo: suitch.activo,
    }
    this.maintenanceService.dscto(req).subscribe(ok => {
      console.log(ok);
      if (ok.error) {
        this.alerts.errorGeneric({title: "Error al descontar", text: ok.error}).then(okAlert => {
          suitch.activo = false
        })
      }
    })


  }


  selectCategoryDet(value, creating) {
    console.log(value);
    console.log(creating);
    if (creating) {
      this.machineService.getAllDetentions().subscribe(ok => {
        this.allDetentionsBySelectedCatDet = value ? ok.filter(o => o.idcategoriaparada == value) : ok
        console.log(this.allDetentionsBySelectedCatDet);
      })
    }
  }


  edit(element) {


    let data = {...element}
//*
    data.fechaprogramada = new Date(data.fechaprogramada).getTime()
    data.fecharealizada = data.fecharealizada ? new Date(data.fecharealizada).getTime() : null
    data.fecharealizadafin = data.fecharealizadafin ? new Date(data.fecharealizadafin).getTime() : null


    console.log(data);


    this.maintenanceService.update(element).subscribe(okUpdated => {
      console.log(okUpdated);
    })
    element.isEdit = false


  }

  delete(data) {
    this.maintenanceService.delete(data).subscribe(okDelete => {
      console.log(okDelete);
      this.maintenanceService.refreshDataTable()
    })

  }

}
