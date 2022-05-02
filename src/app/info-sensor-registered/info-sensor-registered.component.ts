import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Alerts} from "@app/_helpers/alerts";
import {SensorService} from "@app/_services/sensor.service";

@Component({
  selector: 'app-info-sensor-registered',
  templateUrl: './info-sensor-registered.component.html',
  styleUrls: ['./info-sensor-registered.component.sass']
})
export class InfoSensorRegisteredComponent implements OnInit {
  allCategorySensor = []
  dataId = ""
  dataCategorySensor:any = ""

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alert: Alerts,
    private sensorService: SensorService,
    private dialogRef2: MatDialogRef<InfoSensorRegisteredComponent>,

  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.dataId = this.data.data.idreferencia
    this.dataCategorySensor = parseInt(this.data.data.idcategoriasensor)
    this.sensorService.getAll().subscribe(okCats => {
      this.allCategorySensor = okCats
    })
  }
  editar() {
    this.alert.generic("Editar sensor", "¿Estas seguro de editar este sensor?").then(ok => {
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
