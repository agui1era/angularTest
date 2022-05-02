import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MachineService} from "@app/_services/machine.service";
import {CategoryDetentionService} from "@app/_services/categoryDetention.service";
import {InterruptionService} from "@app/_services/interruption.service";
import * as moment from "moment";
import {DetentionService} from "@app/_services/detention.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PlantService} from "@app/_services/plant.service";
import {ProcessService} from "@app/_services/process.service";
import {Alerts} from "@app/_helpers/alerts";

@Component({
  selector: 'app-interruption-manager',
  templateUrl: './interruption-manager.component.html',
  styleUrls: ['./interruption-manager.component.sass']
})
export class InterruptionManagerComponent implements OnInit {

  newInterruptionFormGroup: FormGroup = new FormGroup({
    id: new FormControl(),
    duracion: new FormControl('', Validators.required),
    horainicio: new FormControl('', Validators.required),
    tipo: new FormControl('', Validators.required),
    maquina: new FormControl('', Validators.required),
    planta: new FormControl('', Validators.required),
    proceso: new FormControl('', Validators.required),
    comentario: new FormControl('')
  })
  yaCreo = false
  allMachineSelect = []
  allCategoryDetentions = []
  allDetentionsBySelectedCatDet = []
  selectedCategoryDetention: any = ""
  allDetentionsSelect = []
  allProcs = []
  allProcsResp = []
  allPlants = []
  allPlantsResp = []
  plantSelected: any = ""
  procSelected: any = ""
  loading = false
  allMaqs = []
  allMaqsResp = []
editando = false
  constructor(
    private machineService: MachineService,
    private categoryDetentionsService: CategoryDetentionService,
    private service: InterruptionService,
    private detentionService: DetentionService,
    private dialogRef: MatDialogRef<InterruptionManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private plantService: PlantService,
    private processService: ProcessService,
    private alerts: Alerts
  ) {
  }

  ngOnInit(): void {
    console.log(this.data);
    this.plantService.getAll().subscribe(okPlants => {
      this.allPlants = okPlants
      this.allPlantsResp = okPlants
      this.processService.getAll().subscribe(okPlants => {
        this.allProcs = okPlants
        this.allProcsResp = okPlants
        this.machineService.getAll().subscribe(machines => {
          this.allMachineSelect = machines
          this.allMaqs = machines
          this.allMaqsResp = machines
          this.categoryDetentionsService.dataTable.subscribe(categoryDetentionsAll => {
            if (categoryDetentionsAll) {
              console.log(categoryDetentionsAll);
              // this.allCategoryDetentions = categoryDetentionsAll
              this.allCategoryDetentions = categoryDetentionsAll.filter(o => o.tipo != "programada" || !o.requiereInventario)
            }


            this.detentionService.getAll().subscribe(ok => {
              this.allDetentionsSelect = ok.filter(o => o.idmaqrel == null)

              if (this.data.element) {
                this.editando = true
                this.newInterruptionFormGroup.controls.planta.setValue(this.data.element.maq.idproceso_proceso.idplanta_plantum.id)
                this.plantSelected = this.data.element.maq.idproceso_proceso.idplanta_plantum.id
                this.newInterruptionFormGroup.controls.proceso.setValue(this.data.element.maq.idproceso_proceso.id)
                this.procSelected = this.data.element.maq.idproceso_proceso.id
                this.newInterruptionFormGroup.controls.maquina.setValue(this.data.element.maq.id)
                this.newInterruptionFormGroup.controls.horainicio.setValue(moment(this.data.element.horainicio).format('yyyy-MM-DD')+moment(this.data.element.horainicio).format('THH:mm'))
                this.newInterruptionFormGroup.controls.duracion.setValue(this.data.element.duracion / 60)
                this.selectedCategoryDetention = this.data.element.tipo_parada.idcategoriaparada_categoriadeparada?.id
                this.selectedCategoryDetention = parseInt(this.selectedCategoryDetention)
                this.newInterruptionFormGroup.controls.comentario.setValue(this.data.element.comentario)
                this.newInterruptionFormGroup.controls.tipo.setValue(this.data.element.tipo_parada.nombre)
              }



            })
          })
        })
      })
    })


  }

  cambiarPlanta() {
    this.procSelected = ""
    this.newInterruptionFormGroup.controls.maquina.setValue('')
    if (this.plantSelected) {
      this.allProcs = this.allProcsResp.filter(o => o.idplanta == this.plantSelected)
    } else {
      this.allProcs = this.allProcsResp
    }
  }

  async cambiarProceso() {
    this.newInterruptionFormGroup.controls.maquina.setValue('')

    if (this.procSelected) {
      this.allMaqs = this.allMaqsResp.filter(o => o.idproceso == this.procSelected)

    } else {
      this.allMaqs = this.allMaqsResp
    }
  }

  selectCategoryDet(value, selected) {
    console.log(value);
    this.machineService.getAllDetentions().subscribe(ok => {
      this.allDetentionsBySelectedCatDet = value ? ok.filter(o => o.idcategoriaparada == value) : ok
      console.log(this.allDetentionsBySelectedCatDet);
      this.newInterruptionFormGroup.controls.tipo.setValue(selected)

    })
  }

  createInterruption() {
    this.yaCreo = true
    console.log(this.newInterruptionFormGroup.controls.horainicio.value)

    let horaDate = moment(this.newInterruptionFormGroup.controls.horainicio.value).toDate()
    console.log(horaDate.getHours());
    console.log(horaDate.getMinutes());
    console.log(horaDate.toISOString());

    let req = {
      nombre: this.newInterruptionFormGroup.controls.tipo.value,
      idcategoriaparada: this.selectedCategoryDetention,
      inventarioreq: false,
      idmaquina: this.newInterruptionFormGroup.controls.maquina.value,

    }
    console.log(req);
    this.detentionService.createByMachine(req)
      .subscribe((createdDetention: any) => {
        this.service.create({
          horainicio: horaDate.getTime(),
          duracion: this.newInterruptionFormGroup.controls.duracion.value * 60,
          idmaquina: this.newInterruptionFormGroup.controls.maquina.value,
          comentario: this.newInterruptionFormGroup.controls.comentario.value,
          tipo: createdDetention.id,

        }).subscribe(ok => {
          console.log(ok);
          this.yaCreo = false
          this.dialogRef.close()


        })
      })

  }
  edit() {
    //this.service.dataManagerChangeValue(obj)
    let obj = this.data.element
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
        obj.horainicio = moment(this.newInterruptionFormGroup.controls.horainicio.value).toDate()
        obj.duracion = obj.duracion * 60

        let req = {
          nombre: this.newInterruptionFormGroup.controls.tipo.value,
          idcategoriaparada: this.selectedCategoryDetention,
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
              duracion: this.newInterruptionFormGroup.controls.duracion.value * 60,
              comentario: this.newInterruptionFormGroup.controls.comentario.value,
              tipo: createdDetention.id,
            }
            this.service.update(data).subscribe(ok => {

              this.service.refreshDataTable()

              console.log(ok);
              obj.isEdit = false
              this.yaCreo = false
              this.dialogRef.close()

            })
            console.log(data);
          })


      } else {

      }
    })

  }
  limpiar() {
    this.newInterruptionFormGroup.reset()
    this.selectedCategoryDetention = ""
  }

}
