import {Component, OnInit, ViewChild} from '@angular/core';
import {InterruptionService} from "@app/_services/interruption.service";
import {CategoryDetentionService} from "@app/_services/categoryDetention.service";
import {TurnService} from "@app/_services/turn.service";
import {MachineService} from "@app/_services/machine.service";
import {FormControl, FormControlName, FormGroup, Validators} from "@angular/forms";
import * as moment from 'moment';
import {AppComponent} from "@app/app.component";
import {MatDialog} from "@angular/material/dialog";
import {InterruptionManagerComponent} from "@app/interruption-manager/interruption-manager.component";
import {locale} from "moment/moment";
import {Alerts} from "@app/_helpers/alerts";
import {DetentionService} from "@app/_services/detention.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {PlantService} from "@app/_services/plant.service";
import {ProcessService} from "@app/_services/process.service";
import {DataSource} from "@angular/cdk/collections";
import {SettingsService} from "@app/_services/settings.service";
import {VerInterrupcionComponent} from '@app/ver-interrupcion/ver-interrupcion.component';
import { ColDef } from 'ag-grid-community';

export interface PeriodicElement {

}

@Component({
  selector: 'app-interrupciones',
  templateUrl: './interrupciones.component.html',
  styleUrls: ['./interrupciones.component.sass']
})


export class InterrupcionesComponent implements OnInit {
  loading = false
  paginasTotales:number = 0
  agGridVista = true

  newInterruptionFormGroup: FormGroup = new FormGroup({
    id: new FormControl(),
    duracion: new FormControl('', Validators.required),
    horainicio: new FormControl('', Validators.required),
    tipo: new FormControl('', Validators.required),
    maquina: new FormControl('', Validators.required),
    comentario: new FormControl('', Validators.required)
  })
  filtrosGroup: FormGroup = new FormGroup({
    planta: new FormControl('',),
    categoria: new FormControl('',),
    proceso: new FormControl({value: '', disabled: false}),
    turno: new FormControl('',),
    maquina: new FormControl({value: '', disabled: false}, Validators.required),
    dia: new FormControl('',),

  })
  allMachineSelect = []
  allMachineSelectRespaldo = []
  allInterruptionsList = []
  allCategoryDetentions = []
  selectedCategoryDetention = ""
  allDetentionsSelect = []
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  columnDefs: ColDef[] = [

  ];

  rowData = [

  ];

  dataSource: any = {}


  editing = false
  allDetentionsBySelectedCatDet = []
  allDetentions = []

  allHorarios = []
  allHorariosRespaldo = []

  allPlants = []
  allProcess = []
  allProcessRespaldo = []

  allInterruptionsListRespaldo = []
  allInterruptionsListRespaldo2 = []
  newInterruption: any = {}
  paso = false
  selectedInterruption = {}
  displayedColumns: string[] = ['horaInicio', 'Duracion', 'Maquina', 'Categoria', 'Tipo', 'Comentario', 'confirmar', 'ver', 'Editar', 'Eliminar'];

  constructor(
    private service: InterruptionService,
    private categoryDetentionsService: CategoryDetentionService,
    private turnService: TurnService,
    public dialog: MatDialog,
    private machineService: MachineService,
    private detentionService: DetentionService,
    private alerts: Alerts,
    private plantService: PlantService,
    private processService: ProcessService,
    private settingsService: SettingsService
  ) {
    this.dataSource = new MatTableDataSource([]);

  }

  ngAfterViewInit() {
    console.log("ola");
    /*this.dataSource.paginator = this.paginator;*/

  }

  get f() {
    return this.filtrosGroup.controls;
  }

  ngOnInit(): void {
    this.service.fusionarTodo().subscribe(ok => {
      this.loading = false;
    })
    /*   this.paginator._intl.itemsPerPageLabel = "Registros por página";
       this.paginator._intl.nextPageLabel = "Página siguiente"
       this.paginator._intl.previousPageLabel = "Página anterior"
       this.paginator._intl.lastPageLabel = "Última página"
       this.paginator._intl.firstPageLabel = "Primera página"*/
    this.newInterruption.horainicio = "00:00"
    this.service.dataTable.subscribe((interruptionsAll: any) => {
      if (interruptionsAll?.results?.length >= 0) {
        this.loading = true
        console.log(interruptionsAll);
        this.paginasTotales = parseInt(interruptionsAll?.totalPaginas)
        console.log(this.paginasTotales);
        this.allInterruptionsList = interruptionsAll.results.map(o => {
          let fecha = moment(o.horainicio).format("yyyy-MM-DDTHH:mm")
          return {
            ...o,
            horainicioDisplay: fecha,
            duracionInput: o.duracion / 60
          }
        })
        this.allInterruptionsList = this.allInterruptionsList.filter(o => o.tipo_parada.nombre != 'Baja de velocidad')
        /*this.allInterruptionsList = this.allInterruptionsList.filter(o => o.tipo_parada.nombre != 'Maquina sin producir'
        && o.tipo_parada.comentario != 'Alerta reportada por el sensor')*/
        this.allInterruptionsListRespaldo = this.allInterruptionsList
        this.allInterruptionsListRespaldo2 = this.allInterruptionsList
        this.dataSource = this.allInterruptionsList
        this.dataSource = this.dataSource.sort((a, b) => +moment(b.horainicio).toDate().getTime() - +moment(a.horainicio).toDate().getTime())
      /*  displayedColumns: string[] = ['horaInicio',
          'Duracion', 'Maquina', 'Categoria',
          'Tipo', 'Comentario', 'confirmar',
          'ver', 'Editar', 'Eliminar'];
*/
        this.columnDefs = [
          { field: 'Fecha',sortable:true,filter:true},
          {headerName:'Duración', field: 'Duracion' ,sortable:true,filter:true},
          {headerName:'Máquina', field: 'Maquina',sortable:true,filter:true },
          {headerName:'Categoría', field: 'Categoria' ,sortable:true,filter:true},
          { field: 'Tipo',sortable:true,filter:true },
          { field: 'Comentario' ,sortable:true,filter:true},
        ];
        this.rowData = this.dataSource.map(o=>{
          return{
            Fecha:moment(o.horainicio).format('DD/MM/YYYY HH:mm'),
            Duracion:o.duracion,
            Maquina:o.tipo_parada?.paradamaquinas[0]?.idmaquina_maquina?.nombre,
            Categoria:o.tipo_parada?.idcategoriaparada_categoriadeparada?.nombre,
            Tipo:o.tipo_parada?.nombre,
            Comentario:o.comentario,

          }
        })


        if (!this.paso) {
          //this.dataSource = new MatTableDataSource(this.allInterruptionsList);
          //this.dataSource.paginator = this.paginator

        }
        this.paso = true
        this.loading = false

      }
    })
    this.settingsService.getAll().subscribe(horarioss => {
      this.allHorarios = horarioss
      this.allHorariosRespaldo = horarioss
      this.f.turno.setValue("all")

    })
    this.machineService.getAll().subscribe(machines => {
      this.allMachineSelect = machines
      this.allMachineSelectRespaldo = machines
      this.filtrosGroup.controls.maquina.setValue("all")
    })
    this.plantService.getAll().subscribe(plantss => {
      this.allPlants = plantss
      this.filtrosGroup.controls.planta.setValue("all")
    })
    this.processService.getAll().subscribe(processs => {
      this.allProcess = processs
      this.allProcessRespaldo = processs
      this.filtrosGroup.controls.proceso.setValue("all")
    })
    this.categoryDetentionsService.dataTable.subscribe(categoryDetentionsAll => {
      if (categoryDetentionsAll) {
        console.log(categoryDetentionsAll);
        // this.allCategoryDetentions = categoryDetentionsAll
        this.allCategoryDetentions = categoryDetentionsAll.filter(o => o.tipo != "programada")
      }
    })
    this.getCategoriesDetention()
    this.machineService.getAllDetentions().subscribe(ok => {
      this.allDetentions = ok
      console.log(ok);
    })
    this.detentionService.getAll().subscribe(ok => {

      this.allDetentionsSelect = ok.filter(o => o.idmaqrel == null)

    })
    this.service.dataManager.subscribe(ok => {
      if (ok != undefined) {
        this.editing = true
        let fecha = moment(ok.horainicio).format("YYYY-MM-DDTHH:mm")
        this.newInterruptionFormGroup.controls.horainicio.setValue(fecha)
        this.newInterruptionFormGroup.controls.id.setValue(ok.id)
        this.newInterruptionFormGroup.controls.duracion.setValue(ok.duracion)
        this.newInterruptionFormGroup.controls.comentario.setValue(ok.comentario)
        this.selectCategoryDet(ok.tipo_parada.idcategoriaparada, ok.tipo)
        this.selectedCategoryDetention = ok.tipo_parada.idcategoriaparada
        console.log(ok);
      }
    })
    this.service.refreshDataTable().then(ok => {


    })


  }


  cambiar() {
    console.log("asdasd");
    AppComponent.esAdmin = true
  }

  selectCategory() {
    let opt = this.filtrosGroup.controls.categoria.value
    if (opt == "all") {
      this.allInterruptionsList = this.allInterruptionsListRespaldo

      this.dataSource = new MatTableDataSource<PeriodicElement>(this.allInterruptionsList);

    } else if (opt == "sin definir") {

      this.allInterruptionsList = this.allInterruptionsListRespaldo.filter(o => {
        return o.tipo_parada.idcategoriaparada == null
      })
      if (this.f.maquina.value != "all" || this.f.maquina.value != "") {
        this.allInterruptionsList = this.allInterruptionsListRespaldo.filter(o => {
          return o.tipo_parada.idcategoriaparada == null
        })
      }

      this.dataSource = new MatTableDataSource<PeriodicElement>(this.allInterruptionsList);
    } else {
      this.allInterruptionsList = this.allInterruptionsListRespaldo.filter(o => {
        return o.tipo_parada.idcategoriaparada == opt
      })
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.allInterruptionsList);

    }
  }

  selectPlant() {
    let opt = this.filtrosGroup.controls.planta.value
    if (opt == "all") {
      this.f.proceso.enable()
      this.allInterruptionsList = this.allInterruptionsListRespaldo
      this.allProcess = this.allProcessRespaldo
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.allInterruptionsList);
    } else {
      this.allProcess = this.allProcessRespaldo.filter(o => o.idplanta == opt)
      if (this.allProcess.length == 0) {
        this.f.proceso.disable()
        this.f.maquina.disable()
      } else {
        this.f.proceso.enable()
      }
      console.log(opt);
      console.log(this.allMachineSelect);
      let maquinasList = this.allMachineSelect.filter(o => o.idproceso_proceso.idplanta == opt)

      this.allInterruptionsList = this.allInterruptionsListRespaldo.filter(o => {
        return maquinasList.find(oo => oo.id == o.tipo_parada.paradamaquinas[0].idmaquina)
      })
      this.dataSource = new MatTableDataSource(this.allInterruptionsList);
    }
  }

  confirmar(obj) {
    let req = {
      idcategoriaparada: obj.tipo_parada.idcategoriaparada_categoriadeparada.id,
      nombre: obj.tipo_parada.nombre,
      id: obj.id
    }
    console.log(req);
    console.log(obj);

    this.service.confirm(req).subscribe(okConfirm => {
      console.log(okConfirm);
      this.service.refreshDataTable().then(ok => {
        this.selectMachine()

      })
    })

  }

  ver(element) {
    this.dialog.open(VerInterrupcionComponent, {data: {element}}).afterClosed()
      .subscribe(closed => {

      })
  }

  selectProcess() {
    let opt = this.filtrosGroup.controls.proceso.value
    if (opt == "all") {
      this.f.maquina.enable()
      this.allMachineSelect = this.allMachineSelectRespaldo
      this.allInterruptionsList = this.allInterruptionsListRespaldo
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.allInterruptionsList);
    } else {
      console.log(opt);
      this.allMachineSelect = this.allMachineSelectRespaldo.filter(o => o.idproceso_proceso.id == opt)
      if (this.allMachineSelect.length == 0) {
        this.f.maquina.disable()
      } else {
        this.f.maquina.enable()
      }

      let maquinasList = this.allMachineSelect.filter(o => o.idproceso_proceso.id == opt)
      this.allInterruptionsList = this.allInterruptionsListRespaldo.filter(o => {
        return maquinasList.find(oo => oo.id == o.tipo_parada.paradamaquinas[0].idmaquina)
      })
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.allInterruptionsList);
    }
  }

  selectMachine() {
    let opt = this.f.maquina.value
    if (opt == "all") {
      this.allInterruptionsList = this.allInterruptionsListRespaldo
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.allInterruptionsList);
    } else {

      this.allInterruptionsList = this.allInterruptionsListRespaldo
        .filter(o => opt == o.tipo_parada.paradamaquinas[0].idmaquina)

      this.dataSource = new MatTableDataSource<PeriodicElement>(this.allInterruptionsList);
    }


    /*  let machine = this.filtrosGroup.controls.maquina.value
      if (machine == "all") {
        console.log("todas las interrupciones");
        this.service.refreshDataTable()

      } else if (machine) {

        console.log(`interrupciones de id maquina ${machine}`);
        this.service.refreshDataTable(machine)
      }*/
  }

  selectTurno() {
    console.log(this.f.turno.value);
  }

  cambiarAPagina(nPag) {
    this.loading = true;

    this.service.refreshDataTable(null, nPag).then(ok => console.log(ok))

  }


  selectDia() {
    console.log(this.f.dia.value)
    console.log(this.allInterruptionsList);

    this.allInterruptionsList = this.allInterruptionsListRespaldo.filter(o => {
      console.log(o);

      return new Date(o.horainicio).getTime() >= moment(this.f.dia.value).startOf("day").toDate().getTime() &&
        new Date(o.horainicio).getTime() < moment(this.f.dia.value).endOf("day").toDate().getTime()
    })
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.allInterruptionsList);
  }

  selectTurnoTipo() {

  }


  distinct(list) {

  }

  aniadirCat(element) {
    element.tipo_parada.idcategoriaparada_categoriadeparada = this.allCategoryDetentions.find(o => o.id == element.tipo_parada.idcategoriaparada)
  }

  editInterruption(obj) {
    //this.service.dataManagerChangeValue(obj)
    console.log(obj)
    /*   let fecha= moment(obj.horainicio).format("YYYY-MM-DDThh:mm")
       this.newInterruptionFormGroup.controls.horainicio.setValue(fecha)
       this.newInterruptionFormGroup.controls.comentario.setValue(obj.comentario)
   */
    this.alerts.editAlert("interrupción").then(ok => {
      if (ok.isConfirmed) {
        let fecha = new Date(obj.horainicio)
        console.log(fecha);
        console.log(moment(obj.horainicioDisplay).toDate())
        fecha.setHours(obj.horainicioDisplay.split(":")[0])
        fecha.setMinutes(obj.horainicioDisplay.split(":")[1])
        obj.horainicio = moment(obj.horainicioDisplay).toDate()
        obj.duracion = obj.duracionInput * 60

        let req = {
          nombre: obj.tipo_parada.nombre,
          idcategoriaparada: obj.tipo_parada.idcategoriaparada,
          inventarioreq: false,
          idmaquina: obj.tipo_parada.paradamaquinas[0].idmaquina,

        }
        console.log(req);
        this.detentionService.createByMachine(req)
          .subscribe((createdDetention: any) => {

            //obj.horainicio = fecha.getTime()
            let data = {
              id: obj.id,
              horainicio: obj.horainicio.getTime(),
              duracion: obj.duracionInput * 60,
              comentario: obj.comentario,
              tipo: createdDetention.id,
            }
            this.service.update(data).subscribe(ok => {
              this.service.refreshDataTable()

              console.log(ok);
              obj.isEdit = false
            })
            console.log(data);
          })


      } else {

      }
    })

  }

  detentionsByCat(element) {


    let categoried = this.allDetentions.filter(o => o.idcategoriaparada == element.tipo_parada.idcategoriaparada)
    let existent = categoried.find(o => o.id == element.tipo)
    let theList: any[] = [...categoried]
    let distinct = new Set(theList)
    theList = [...distinct]
    theList = theList.filter(o => o.nombre != element.tipo_parada.nombre)
    theList.push(existent)
    return theList


  }

  cancelEdition() {
    this.service.refreshDataTable()

  }

  deleteInterruption(obj) {
    console.log(obj)
    this.alerts.deleteAlert("interrupción").then(ok => {
      if (ok.isConfirmed) {
        this.service.delete(obj).subscribe(ok => {
          console.log(ok);
          this.service.refreshDataTable()
          this.selectMachine()
        })
      }
    })

  }

  openCreateInterruption() {
    const dialogRef = this.dialog.open(InterruptionManagerComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.service.refreshDataTable()
      this.selectMachine()
    });
  }

  openEditInterruption(element) {
    const dialogRef = this.dialog.open(InterruptionManagerComponent, {
      data: {element}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.service.refreshDataTable()
      this.selectMachine()
    });
  }


  selectCategoryDet(value, selected) {
    console.log("value");
    console.log(value);
    this.machineService.getAllDetentions().subscribe(ok => {
      this.allDetentionsBySelectedCatDet = value ? [...new Set(ok.filter(o => o.idcategoriaparada == value))] : ok
      console.log(this.allDetentionsBySelectedCatDet);
      this.selectedCategoryDetention = selected


    })
  }

  selectDetention(value) {
    console.log(value);

  }


  getCategoriesDetention() {
    this.categoryDetentionsService.refreshDataTable()
  }


}
