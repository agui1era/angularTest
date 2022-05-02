import {Component, Inject, OnInit} from '@angular/core';
import {MachineService} from "@app/_services/machine.service";
import {InterruptionService} from "@app/_services/interruption.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Alerts} from "@app/_helpers/alerts";
import {DetentionService} from "@app/_services/detention.service";
import {AlertDetentionComponent} from "@app/alert-detention/alert-detention.component";

@Component({
  selector: 'app-select-alert-detention',
  templateUrl: './select-alert-detention.component.html',
  styleUrls: ['./select-alert-detention.component.sass']
})
export class SelectAlertDetentionComponent implements OnInit {

  inputNombreValue = ""
  detentionsOfMachine = []

  constructor(
    private machineService: MachineService,
    private interruptionService: InterruptionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alerts: Alerts,
    private dialogRef: MatDialogRef<SelectAlertDetentionComponent>,
    private dialogRef2: MatDialogRef<AlertDetentionComponent>,
    private detentionService: DetentionService
  ) {
  }


  ngOnInit(): void {
    console.log(this.data);

    this.machineService.getAllDetentionsByMachine(this.data.activeTurn.idturno_turno.idmaquina,this.data.category.id)
      .subscribe(allDet => {
        console.log(allDet);
        this.detentionsOfMachine = allDet.map(o=>o.idparada_parada)
        console.log(this.detentionsOfMachine);
        this.detentionsOfMachine = this.detentionsOfMachine.filter(o => o.idcategoriaparada == this.data.category.id && o.idmaqrel != null)
      })/*
    this.machineService.getAllDetentions()
      .subscribe(allDet => {
        console.log(allDet);
        this.detentionsOfMachine = allDet.filter(o => o.idcategoriaparada == this.data.category.id && o.idmaqrel == null)
      })*/


  }

  crearParada() {

    this.alerts.generic("¿Estas seguro?", "estas apunto de crear una interrupción, ¿Deseas continuar?")
      .then(ok => {
        if (ok.isConfirmed) {

          let req = {
            nombre: this.inputNombreValue,
            idcategoriaparada: this.data.category.id,
            inventarioreq: false,
            idmaquina: this.data.activeTurn.idturno_turno.idmaquina,

          }
          console.log(req);
          console.log(this.data.intInfo)


          this.detentionService.createByMachine(req)
            .subscribe((createdDetention: any) => {
              console.log(createdDetention);

              if (this.data.intInfo) {
                let req = {
                  id: this.data.intInfo.info.id,
                  tipo: createdDetention.id,
                }
                console.log(this.data.intInfo);
                this.interruptionService.update({
                  id: this.data.intInfo.info.id,
                  tipo: createdDetention.id,
                }).subscribe(createdInterruption => {
                  console.log(createdInterruption);
                })

              } else {
                let req = {
                  horainicio: this.data.fechaI ? this.data.fechaI :"now",
                  duracion: this.data.duracion? (this.data.duracion * 60) : 0,
                  tipo: createdDetention.id,
                  comentario: "",
                }
                this.interruptionService.create(req).subscribe(createdInterruption => {
                  console.log(createdInterruption);
                })
              }


              // this.dialogRef2.close()
              this.dialogRef.close(true)

            })
        }
      })

  }


}
