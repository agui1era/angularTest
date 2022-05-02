import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Alerts} from '@app/_helpers/alerts';
import {SensorService} from "@app/_services/sensor.service";

@Component({
  selector: 'app-sensor-register',
  templateUrl: './sensor-register.component.html',
  styleUrls: ['./sensor-register.component.sass']
})
export class SensorRegisterComponent implements OnInit {

  allCategorySensor = []
  dataId = ""
  dataCategorySensor = ""

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alert: Alerts,
    private sensorService: SensorService,
    private dialogRef2: MatDialogRef<SensorRegisterComponent>,

  ) {
  }

  ngOnInit(): void {
    this.dataId = this.data.data.idreferencia
    this.sensorService.getAll().subscribe(okCats => {
      this.allCategorySensor = okCats
    })
  }

  registrar() {
    this.alert.generic("Registrar sensor", "¿Estas seguro de registrar este sensor?").then(ok => {
      if (ok.isConfirmed) {
        this.sensorService.registerSensor({
          id:this.data.data.id,
          idcategoriasensor:this.dataCategorySensor
        }).subscribe(okRegistrar => {
          console.log(okRegistrar);
          this.dialogRef2.close();
        })
      }
    })
  }


}
