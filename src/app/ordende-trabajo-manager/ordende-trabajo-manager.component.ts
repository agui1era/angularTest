import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MachineService} from '@app/_services/machine.service';
import {SubproductService} from "@app/_services/subproduct.service";
import * as moment from "moment";
import {OrdenDeTrabajoService} from "@app/_services/ordenDeTrabajo.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MaintenanceManagerComponent} from "@app/maintenance-manager/maintenance-manager.component";
import {ProcessService} from '@app/_services/process.service';
import {SubproductmachineService} from "@app/_services/subproductmachine.service";
import {PlantService} from "@app/_services/plant.service";
import {Alerts} from "@app/_helpers/alerts";
import {FormControl} from "@angular/forms";
import {MatSelect} from "@angular/material/select";
import {Subject} from "rxjs";
import {take, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-ordende-trabajo-manager',
  templateUrl: './ordende-trabajo-manager.component.html',
  styleUrls: ['./ordende-trabajo-manager.component.sass']
})
export class OrdendeTrabajoManagerComponent implements OnInit {
  @Input("esOperador") esOperador = false
  @Input("conMaquina") conMaquina: any = null
  /** control for the selected bank */
  public bankCtrl: FormControl = new FormControl();
  @ViewChild('singleSelect', {static: true}) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  /** control for the MatSelect filter keyword */
  public bankFilterCtrl: FormControl = new FormControl();
  yaCreo = false
  inputNombre = ""
  inputCodigo = ""
  inputFechaI = ""
  inputCantidadE = ""
  inputFoto: any = ""
  spSelectedIdFilter: any = ""
  spSelected: any = {}
  spSelectedId: any = ""
  maqSelected: any = null
  formatoSelected: any = ""
  unidadSelected: any = ""
  condicionSelected: any = ""
  allSp = []
  allSpResp = []
  allMaqs = []
  allMaqsResp = []
  fechaPrediccion = ""
  procesoSelected: any = ""
  isEdit = false;
  idEdit = "";
  allProcs = []
  allProcsResp = []
  allPlants = []
  allPlantsResp = []
  plantSelected: any = ""
  procSelected: any = ""
  loading = true

  constructor(
    private machineService: MachineService,
    private subproductService: SubproductService,
    private procesoService: ProcessService,
    private ordenDeTrabajoService: OrdenDeTrabajoService,
    private dialogRef: MatDialogRef<MaintenanceManagerComponent>,
    private machineSpService: SubproductmachineService,
    private alerts: Alerts,
    private plantService: PlantService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
    this.loading = true
    // listen for search field value changes
    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();

      });
    console.log(this.data);
    this.inputFechaI = moment().format("YYYY-MM-DD") + moment().format("THH:mm")
    console.log(this.isEdit);
    this.machineService.getAll().subscribe(okMaqs => {
      this.allMaqs = okMaqs
      this.allMaqsResp = okMaqs
      this.procesoService.getAll().subscribe(ok => {
        this.allProcs = ok
        this.allProcsResp = ok
        this.plantService.getAll().subscribe(ok => {
          this.allPlants = ok
          this.allPlantsResp = ok
          this.subproductService.getAll().subscribe(okSp => {
            this.allSpResp = okSp
            this.allSp = this.convertirListaAtributosSp(okSp)

            if (this.esOperador || this.data?.operador) {

              this.spMaquina(this.conMaquina || this.data.maquina).then(okMaqSp => {
                console.log(okMaqSp);
                this.allSp = this.convertirListaAtributosSp(okMaqSp.map(o => o.idsubproducto_subproducto))
                this.maqSelected = this.conMaquina || this.data.maquina
                this.maqSelected = parseInt(this.maqSelected)
                let maqRecord = this.allMaqsResp.find(o => o.id == this.maqSelected)
                maqRecord.proceso = this.allProcsResp.find(o => o.id == maqRecord.idproceso)
                this.plantSelected = parseInt(maqRecord.proceso.idplanta)
                this.procSelected = parseInt(maqRecord.idproceso)
              })
            }
            if (this.data?.data) {
              let ot = this.data.data
              this.isEdit = true
              this.idEdit = ot.id
              this.inputNombre = ot.nombre
              this.inputFechaI = ot.horainicio ? moment(ot.horainicio).format("yyyy-MM-DDTHH:mm") : ''
              this.inputCodigo = ot.codigo
              this.inputFoto = ot.foto
              this.procSelected = parseInt(ot.idproceso)
              this.cambiarProceso()
              this.maqSelected = parseInt(ot.idmaquina)
              this.plantSelected = parseInt(ot.idplanta)

              if (ot.idsubproducto_subproducto) {
                let sp = [ot.idsubproducto_subproducto]
                sp = this.convertirListaAtributosSp(sp)
                this.spSelected = sp[0]
                this.spSelectedId = sp[0].id
                this.bankCtrl.setValue(this.spSelectedId)
              }

              this.formatoSelected = ot.idsubproducto_subproducto?.formato
              this.unidadSelected = ot.idsubproducto_subproducto?.unidad
              this.condicionSelected = ot.idsubproducto_subproducto?.condicion
              this.inputCantidadE = ot.cantidadesperada

            }
            this.loading = false


          })
        })
      })
    })


  }

  cambiarSpMaquina() {
    console.log(this.maqSelected);
    if (this.maqSelected) {
      this.machineSpService.getAll(this.maqSelected).subscribe(okSpMaq => {
        this.allSp = this.convertirListaAtributosSp(okSpMaq.map(o => o.idsubproducto_subproducto))

      })
    } else {
      this.allSp = this.convertirListaAtributosSp(this.allSpResp)
    }

  }

  convertirListaAtributosSp(listaSp) {
    console.log("listaSp");
    console.log(listaSp);
    let listaSpVar = listaSp.slice()
    listaSpVar = listaSpVar.map(o => {
      return {...o, formato: o.formato.split(",")}
    })
    listaSpVar = listaSpVar.map(o => {
      return {...o, unidad: o.unidad.split(",")}
    })
    listaSpVar = listaSpVar.map(o => {
      return {...o, condicion: o.condicion.split(",")}
    })
    return listaSpVar
  }

  spMaquina(idMaq) {
    return this.machineSpService.getAll(idMaq).toPromise()

  }

  crear() {
    console.log(this.bankCtrl.value)
    this.yaCreo = true
    let req = {
      nombre: this.inputNombre,
      codigo: this.inputCodigo,
      cantidadesperada: this.inputCantidadE,
      horainicio: moment(this.inputFechaI).toDate().getTime(),
      idsubproducto: this.spSelected.id,
      idmaquina: this.maqSelected,
      formatoelegido: this.spSelected.formato.join(","),
      condicionelegida: this.spSelected.condicion.join(","),
      idproceso: this.procSelected,
      idplanta: this.plantSelected,
      unidadelegida: this.spSelected.unidad.join(","),
      foto: this.inputFoto,
    }
    console.log(req);
    this.ordenDeTrabajoService.create(req).subscribe(okOT => {
      console.log(okOT);
      this.ordenDeTrabajoService.refreshDataTable()
      this.alerts.successFullAlert("Orden creada")
      this.yaCreo = false
      this.dialogRef.close()
    },error=>{
      console.log(error);
      this.alerts.errorAlert(error)
      this.yaCreo = false

    })
  }

  editar() {
    let req = {
      id: this.idEdit,
      nombre: this.inputNombre,
      codigo: this.inputCodigo,
      cantidadesperada: this.inputCantidadE,
      horainicio: moment(this.inputFechaI).toDate().getTime(),
      idsubproducto: this.spSelected.id,
      idmaquina: this.maqSelected,
      formatoelegido: this.spSelected.formato.join(","),
      condicionelegida: this.spSelected.condicion.join(","),
      idproceso: this.procSelected,
      idplanta: this.plantSelected,
      unidadelegida: this.spSelected.unidad.join(","),
      foto: this.inputFoto,
    }
    console.log(req);
    this.ordenDeTrabajoService.update(req).subscribe(okOT => {
      console.log(okOT);
      this.ordenDeTrabajoService.refreshDataTable()
      this.alerts.successFullAlert("Orden editada")

      this.dialogRef.close()
    })
  }

  handleUpload(event) {
    const file = event.target.files[0]
    if (file.size > 3072000) {
      alert("too big")
    }
    console.log(file.size);
    console.log(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.inputFoto = reader.result.toString()/*.split("base64,")[1]*/
      console.log(this.inputFoto);
    };
  }

  cambiarSp() {
    console.log(this.spSelectedId);
    console.log(this.allSp);
    this.spSelected = this.allSp.find(o => o.id == this.bankCtrl.value);
    console.log(this.spSelected);
  }

  async cambiarProceso() {
    if (this.procSelected) {
      this.allMaqs = this.allMaqsResp.filter(o => o.idproceso == this.procSelected)
      this.allSp = []
      for (let m of this.allMaqs) {
        let spDeMaquina = await this.spMaquina(m.id)
        this.allSp.push(...this.convertirListaAtributosSp(spDeMaquina.map(o => o.idsubproducto_subproducto)))
      }
    } else {
      this.allMaqs = this.allMaqsResp
      this.allSp = this.convertirListaAtributosSp(this.allSpResp)
    }
  }

  cambiarPlanta() {
    this.procSelected = ""
    if (this.plantSelected) {
      this.allProcs = this.allProcsResp.filter(o => o.idplanta == this.plantSelected)
    } else {
      this.allProcs = this.allProcsResp
    }
  }

  predecirFecha() {
    if (this.spSelected.velprod && this.inputCantidadE && this.inputFechaI) {
      this.fechaPrediccion = moment(this.inputFechaI).format("yyyy-MM-DD HH:mm")

    }
  }

  protected filterBanks() {
    if (!this.allSp) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value;
    if (!search) {
      /*  if (this.esOperador || this.data?.operador) {

          this.spMaquina(this.conMaquina || this.data.maquina).then(okMaqSp => {
            this.allSp = this.convertirListaAtributosSp(okMaqSp.map(o => o.idsubproducto_subproducto))
          })
        }*/
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the banks
    /*if (this.esOperador || this.data?.operador) {
      this.spMaquina(this.conMaquina || this.data.maquina).then(okMaqSp => {
        this.allSp = this.convertirListaAtributosSp(okMaqSp.map(o => o.idsubproducto_subproducto))
      })
    /!*  this.spMaquina(this.conMaquina || this.data.maquina).then(okMaqSp => {
        this.allSpResp = this.convertirListaAtributosSp(okMaqSp.map(o => o.idsubproducto_subproducto))
        this.allSp = this.allSpResp.filter(bank => `${bank.nombre} ${bank.unidad} ${bank.formato} ${bank.condicion}`.toLowerCase().indexOf(search) > -1)

      })*!/
    } else {

      this.allSp = this.allSpResp.filter(bank => `${bank.nombre} ${bank.unidad} ${bank.formato} ${bank.condicion}`.toLowerCase().indexOf(search) > -1)

    }*/
    if (this.maqSelected) {
      this.spMaquina(this.maqSelected).then(okMaqSp => {
        this.allSp = okMaqSp.map(o => o.idsubproducto_subproducto).filter(bank => `${bank.nombre} ${bank.unidad} ${bank.formato} ${bank.condicion}`.toLowerCase().indexOf(search) > -1)
        if (this.allSp.length > 0) {
          this.allSp = this.convertirListaAtributosSp(this.allSp)
        }
      })
    } else {
      this.allSp = this.allSpResp.filter(bank => `${bank.nombre} ${bank.unidad} ${bank.formato} ${bank.condicion}`.toLowerCase().indexOf(search) > -1)
      if (this.allSp.length > 0) {
        this.allSp = this.convertirListaAtributosSp(this.allSp)
      }
    }


  }
}
