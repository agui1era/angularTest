import {Component, OnInit} from '@angular/core';
import {MachineService} from '@app/_services/machine.service';
import {SensorService} from '@app/_services/sensor.service';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-machine-sensor-manager',
  templateUrl: './machine-sensor-manager.component.html',
  styleUrls: ['./machine-sensor-manager.component.sass']
})
export class MachineSensorManagerComponent implements OnInit {
  idmaquinaSelected: any = 0
  sensorRList = []

  constructor(
    private sensorService: SensorService,
    private machineService: MachineService,
    private _snackBar: MatSnackBar

  ) {
  }

  ngOnInit(): void {
    let idMachine = this.machineService.machineInEditIdValue
    console.log(idMachine);
    this.idmaquinaSelected = idMachine
    this.sensorService.getAllRegistered()
      .subscribe(okAllRegistered => {
        this.sensorRList = okAllRegistered
          .filter(o => o.idmaquina == null || o.idmaquina == idMachine)
        this.sensorService.getRegisteredByMachine(idMachine).subscribe(okByMachine => {
          console.log("okByMachine");
          console.log(okByMachine);
          this.sensorRList = this.sensorRList.map(o => {
            return {
              ...o,
              activo: okByMachine.find(oo => oo.id == o.id) ? true : false
            }
          })
        })


      })

  }
  openSnackBar(message: string) {
    this._snackBar.open(message, 'cerrar', {duration: 1700});
  }
  selecSensor(sensor) {
    let req = {}
    if (sensor.activo) {
      req = {
        id: sensor.id,
        idmaquina: this.idmaquinaSelected
      }

    } else {
      req = {
        id: sensor.id,
        idmaquina: null
      }
    }
    this.sensorService.asociarMaquina(req).subscribe(okAsocio=>{
      console.log(okAsocio);
      this.openSnackBar("Acción realizada correctamente")
    })
  }


}
