import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AlertDetentionComponent} from "@app/alert-detention/alert-detention.component";
import * as moment from "moment";

@Component({
  selector: 'app-new-interruption-duration',
  templateUrl: './new-interruption-duration.component.html',
  styleUrls: ['./new-interruption-duration.component.sass']
})
export class NewInterruptionDurationComponent implements OnInit {

  duracionInput: any = 0
  duracionDate: any = 0
  duracionDateHoy: any = 0
  duracionCalculo:any = 0
  esteTurno:any = ""

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef2: MatDialogRef<NewInterruptionDurationComponent>,
  ) {
  }

  ngOnInit(): void {
    console.log(this.data);
    this.duracionDateHoy = moment(this.data.infoInt.fechaI).format("yyyy-MM-DDTHH:mm")
    this.duracionDate = this.duracionDateHoy
    this.esteTurno = JSON.parse(localStorage.getItem("activeTurn"))
  }

  openCreateInt() {
    this.dialog.open(AlertDetentionComponent, {
      data: {
        duracion: this.duracionCalculo,
        fechaI: this.data.infoInt.fechaI
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef2.close(true)
      }
    })
  }
  calcularDuracion(){
    console.log(this.duracionDate);
    this.duracionCalculo = moment.duration(moment(this.duracionDate).diff(this.duracionDateHoy)).asMinutes()
  }
  sinDuracion(){
    this.duracionCalculo = undefined
  }

}
