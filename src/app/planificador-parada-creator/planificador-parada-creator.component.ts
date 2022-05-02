import {Component, Inject, Input, OnInit} from '@angular/core';
import {MachineService} from "@app/_services/machine.service";
import {CategoryDetentionService} from "@app/_services/categoryDetention.service";
import * as moment from "moment";
import {InterruptionService} from '@app/_services/interruption.service';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DetentionService} from "@app/_services/detention.service";

@Component({
  selector: 'app-planificador-parada-creator',
  templateUrl: './planificador-parada-creator.component.html',
  styleUrls: ['./planificador-parada-creator.component.sass']
})
export class PlanificadorParadaCreatorComponent implements OnInit {
  selectedMachine = ""
  selectedDetention = ""
  selectedCategory = ""
  loading = false
  maquinasList = []
  categoryList = []
  detentionsOfMachine = []
  fechaI = ""
  fechaF = ""
  comentarios = ""

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private machineService: MachineService,
    private categoryDetentionsService: CategoryDetentionService,
    private interruptionService: InterruptionService,
    private detentionService: DetentionService,
    private dialogRef2: MatDialogRef<PlanificadorParadaCreatorComponent>,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.maquinasList = await this.machineService.getAll().toPromise()
    this.categoryList = await this.categoryDetentionsService.getAll().toPromise()
    this.fechaI = moment(Date.now()).format("YYYY-MM-DD") + "T" + moment(Date.now()).format("HH:mm:ss")
    this.fechaF = moment(Date.now()).format("YYYY-MM-DD") + "T" + moment(Date.now()).format("HH:mm:ss")

  }

  chooseDetentions() {
    this.machineService.getAllDetentionsByMachine(this.selectedMachine, this.selectedCategory)
      .subscribe(allDet => {
        console.log(allDet);
        this.detentionsOfMachine = allDet.map(o => o.idparada_parada)
        console.log(this.detentionsOfMachine);
        this.detentionsOfMachine = this.detentionsOfMachine.filter(o => o.idcategoriaparada == this.selectedCategory && o.idmaqrel != null)
        console.log(this.detentionsOfMachine);

      })
  }

  cambioMaquina() {
    this.selectedCategory = ""
    this.selectedDetention = ""
  }

  crear() {
  this.loading = true
    let reqDetention = {
      nombre: this.selectedDetention,
      idcategoriaparada: this.data?.categoryID,
      idmaquina: this.selectedMachine,

    }
    this.detentionService.createByMachine(reqDetention)
      .subscribe((createdDetention: any) => {

        let req = {
          horainicio: moment(this.fechaI).toDate().getTime(),
          duracion: moment.duration(moment(this.fechaF).diff(moment(this.fechaI))).asSeconds(),
          idmaquina: this.selectedMachine,
          tipo: createdDetention.id,
          comentario: this.comentarios,
        }
        this.interruptionService.create(req).subscribe(okDet => {
          console.log(okDet);
          this.loading = false
          this.dialogRef2.close();
        })
      })

  }


}
