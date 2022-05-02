import {Component, Inject, OnInit} from '@angular/core';
import {MachineService} from "@app/_services/machine.service";
import {DetentionService} from "@app/_services/detention.service";
import {InterruptionService} from "@app/_services/interruption.service";
import {MaintenanceService} from "@app/_services/maintenance.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CategoryDetentionService} from "@app/_services/categoryDetention.service";
import * as moment from "moment";
import {PlantService} from "@app/_services/plant.service";
import {ProcessService} from "@app/_services/process.service";

@Component({
  selector: 'app-maintenance-manager',
  templateUrl: './maintenance-manager.component.html',
  styleUrls: ['./maintenance-manager.component.sass']
})
export class MaintenanceManagerComponent implements OnInit {
  yaCreo = false
  newInterruption: any = {}
  allMachineSelect = []
  allMachineList = []
  allCategoryDetentions = []
  allDetentionsBySelectedCatDet = []
  selectedCategoryDetention = ""
  allDetentions = []
  allCategoryDetentionsList = []
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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private machineService: MachineService,
    private categoryDetentionService: CategoryDetentionService,
    private detentionService: DetentionService,
    private interruptionService: InterruptionService,
    private maintenanceService: MaintenanceService,
    private dialogRef: MatDialogRef<MaintenanceManagerComponent>,
    private plantService: PlantService,
    private processService: ProcessService
  ) {
  }

  async ngOnInit(): Promise<void> {
    console.log(this.data);
    this.allPlants = await this.plantService.getAll().toPromise()
    this.allPlantsResp = this.allPlants
    this.allProcs = await this.processService.getAll().toPromise()
    this.allProcsResp = this.allProcs
    this.allMachineList = await this.machineService.getAll().toPromise()
    this.allMaqs = this.allMachineList
    this.allMaqsResp = this.allMaqs
    this.allCategoryDetentionsList = await this.categoryDetentionService.getAll().toPromise()
    this.allDetentions = await this.detentionService.getAll().toPromise()
    let mantCat = this.allCategoryDetentionsList.find(o => o.tipo == "programada")
    this.allDetentions = this.allDetentions.filter(o => o.idcategoriaparada == mantCat.id && o.idmaqrel == null)
    if (this.data.element) {
      this.editando = true
      this.newInterruption.idmaquina = this.data.element.idinterrupcion_interrupcion?.tipo_parada?.paradamaquinas[0]?.machineData?.id
      this.newInterruption.idmaquina = this.newInterruption.idmaquina.toString();
      this.newInterruption.horainicio = moment(this.data.element.fechaprogramada).format('yyyy-MM-DD') + moment(this.data.element.fechaprogramada).format('THH:mm')
      this.newInterruption.duracion = this.data.element.idinterrupcion_interrupcion.duracion / 60
      this.newInterruption.tipoNombre = this.data.element.idinterrupcion_interrupcion.tipo_parada.nombre
      this.newInterruption.comentario = this.data.element.idinterrupcion_interrupcion.comentario
      this.plantSelected = this.data.element.idinterrupcion_interrupcion?.tipo_parada?.paradamaquinas[0]?.machineData?.idproceso_proceso?.idplanta_plantum?.id
      this.procSelected = this.data.element.idinterrupcion_interrupcion?.tipo_parada?.paradamaquinas[0]?.machineData?.idproceso_proceso?.id
    }

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

  cambiarPlanta() {
    this.procSelected = ""
    this.newInterruption.idmaquina = ""

    if (this.plantSelected) {
      this.allProcs = this.allProcsResp.filter(o => o.idplanta == this.plantSelected)
    } else {
      this.allProcs = this.allProcsResp
    }
  }

  async cambiarProceso() {
    this.newInterruption.idmaquina = ""
    if (this.procSelected) {
      this.allMaqs = this.allMaqsResp.filter(o => o.idproceso == this.procSelected)

    } else {
      this.allMaqs = this.allMaqsResp
    }
  }

  crear() {
    this.yaCreo = true
    this.newInterruption.horainicio = new Date(this.newInterruption.horainicio).getTime()
    console.log(this.newInterruption);
    let mantCat = this.allCategoryDetentionsList.find(o => o.nombre == 'Mantenimiento')

    let req = {
      nombre: this.newInterruption.tipoNombre,
      idcategoriaparada: mantCat.id,
      inventarioreq: true,
      idmaquina: this.newInterruption.idmaquina,

    }
    this.detentionService.createByMachine(req).subscribe((createdDetention: any) => {
      this.interruptionService.create(
        {
          horainicio: this.newInterruption.horainicio,
          duracion: this.newInterruption.duracion * 60,
          idmaquina: this.newInterruption.idmaquina,
          comentario: this.newInterruption.comentario,
          tipo: createdDetention.id,
        }
      ).subscribe(okInterruption => {
        this.maintenanceService.create({
          "idinterrupcion": okInterruption.id,
          "fechaprogramada": this.newInterruption.horainicio,
          "nombre": this.newInterruption.nombreMant
        }).subscribe(okMaintenance => {
          console.log(okMaintenance);
          this.yaCreo = false
          this.maintenanceService.refreshDataTable()
          this.dialogRef.close()
        })
      })
    })


  }

  edit() {


    let data = {...this.newInterruption, id: this.data.element.id}
//*
    console.log(data);
    console.log(this.data);


    data.fechaprogramada = new Date(data.horainicio).getTime()
    data.fecharealizada = this.data.element.fecharealizada ? new Date(this.data.element.fecharealizada).getTime() : null
    data.fecharealizadafin = this.data.element.fecharealizadafin ? new Date(this.data.element.fecharealizadafin).getTime() : null
    let mantCat = this.allCategoryDetentionsList.find(o => o.tipo == "programada")

    let req = {
      nombre: this.newInterruption.tipoNombre,
      idcategoriaparada: mantCat.id,
      inventarioreq: true,
      idmaquina: this.newInterruption.idmaquina,

    }
    this.detentionService.createByMachine(req).subscribe((createdDetention: any) => {
      console.log(data);
      this.interruptionService.update(
        {
          id:this.data.element.idinterrupcion_interrupcion.id,
          duracion: this.newInterruption.duracion * 60,
          comentario: this.newInterruption.comentario,
          tipo: createdDetention.id,
        }
      ).subscribe(okInterruption => {
        this.maintenanceService.update(data).subscribe(okUpdated => {
          console.log(okUpdated);
          this.dialogRef.close()

        })
      })
    })

  }

}
