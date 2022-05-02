import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AlertDetentionComponent} from "@app/alert-detention/alert-detention.component";
import * as moment from "moment";
import {InventoryMaintenanceManagerComponent} from "@app/inventory-maintenance-manager/inventory-maintenance-manager.component";

@Component({
  selector: 'app-ver-mantencion',
  templateUrl: './ver-mantencion.component.html',
  styleUrls: ['./ver-mantencion.component.sass']
})
export class VerMantencionComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef2: MatDialogRef<VerMantencionComponent>,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.element.fecharealizadafin) {

      var startTime = moment(this.data.element.fecharealizada);
      var endTime = moment(this.data.element.fecharealizadafin);

      let difInSecs = endTime.diff(startTime, 'seconds')
      this.data.element.duracionRealCalculo = (difInSecs / 60).toFixed(2)
      this.data.element.duracionCalculo = this.data.element.idinterrupcion_interrupcion.duracion / 60

    }
  }
  openInventoryMenu(obj) {
    this.dialog.open(InventoryMaintenanceManagerComponent, {
      data: {
        create: true,
        detention: obj.idinterrupcion_interrupcion.tipo_parada
      }
    })
  }
}
