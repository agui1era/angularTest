import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NewInterruptionDurationComponent} from "@app/new-interruption-duration/new-interruption-duration.component";
import * as moment from "moment";

@Component({
  selector: 'app-detalle-scheduler-info-prod',
  templateUrl: './detalle-scheduler-info-prod.component.html',
  styleUrls: ['./detalle-scheduler-info-prod.component.sass']
})
export class DetalleSchedulerInfoProdComponent implements OnInit {

  total = 0

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dialogRef2: MatDialogRef<DetalleSchedulerInfoProdComponent>,

  ) {

  }

  ngOnInit(): void {
    this.total = this.data.listaProds.map(o => o.cantidad).reduce((a, b) => +a + +b, 0)
    console.log(this.data);

  }

  openCreateInterruption() {
    let turno = JSON.parse(localStorage.getItem("activeTurn"))

    let fechaI = moment(turno.dia).hours(this.data.infoMin.hora.split(":")[0]).minutes(this.data.infoMin.min).toDate().getTime()
    this.dialog.open(NewInterruptionDurationComponent, {
      data: {
        infoInt: {
          fechaI
        }
      }
    }).afterClosed().subscribe(result=>{
      if (result) {
        this.dialogRef2.close();
      }
    })
  }


}
