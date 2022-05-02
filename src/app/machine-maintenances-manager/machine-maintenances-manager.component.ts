import {Component, OnInit} from '@angular/core';
import {MachineMaintenanceService} from "@app/_services/machineMaintenance.service";
import {MatDialog} from "@angular/material/dialog";
import {MaquinasMantCreatorComponent} from "@app/maquinas-mant-creator/maquinas-mant-creator.component";
import {MachineService} from "@app/_services/machine.service";

@Component({
  selector: 'app-machine-maintenances-manager',
  templateUrl: './machine-maintenances-manager.component.html',
  styleUrls: ['./machine-maintenances-manager.component.sass']
})
export class MachineMaintenancesManagerComponent implements OnInit {
  displayedColumns = ["parada", "frecuencia", "duracion", "editar", "eliminar"]
  maquinaMants = []
  idmaquina: any = ""

  constructor(
    private machineService: MachineService,
    private maquinaMantService: MachineMaintenanceService,
    private dialog: MatDialog
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.idmaquina = this.machineService.machineInEditIdValue
    console.log(this.idmaquina);
    await this.obtenerMantencionesMaquina()
    console.log(this.maquinaMants);

  }

  async obtenerMantencionesMaquina() {
    this.maquinaMants = await this.maquinaMantService.getAll(this.idmaquina).toPromise()
    console.log(this.maquinaMants);
  }

  openAgregarMM() {
    this.dialog.open(MaquinasMantCreatorComponent).afterClosed().subscribe(ok => {
      this.obtenerMantencionesMaquina().then(ok => console.log(ok))
    })
  }

  editar(elm) {
    this.dialog.open(MaquinasMantCreatorComponent, {
      data: {
        elm
      }
    }).afterClosed().subscribe(ok => {
      this.obtenerMantencionesMaquina().then(ok => console.log(ok))
    })
  }

  borrar(id) {
    this.maquinaMantService.delete(id).subscribe(ok=>{
      console.log(ok);
      this.obtenerMantencionesMaquina().then(okk=>{
        console.log(okk);
      })
    })
  }

}
