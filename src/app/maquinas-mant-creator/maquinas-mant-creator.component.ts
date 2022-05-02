import {Component, Inject, OnInit} from '@angular/core';
import {CategoryDetentionService} from '@app/_services/categoryDetention.service';
import {MachineService} from '@app/_services/machine.service';
import {MachineMaintenanceService} from "@app/_services/machineMaintenance.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-maquinas-mant-creator',
  templateUrl: './maquinas-mant-creator.component.html',
  styleUrls: ['./maquinas-mant-creator.component.sass']
})
export class MaquinasMantCreatorComponent implements OnInit {
  paradaP: any = ""
  frecuencia: any = ""
  duracion: any = ""
  machineSelectedId: any = ""
  paradasP: any = []

  constructor(
    private maquinaMantService: MachineMaintenanceService,
    private machineService: MachineService,
    private categoryDetentionsService: CategoryDetentionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dialogRef2: MatDialogRef<MaquinasMantCreatorComponent>,

  ) {
  }

  async ngOnInit(): Promise<void> {
    this.machineSelectedId = this.machineService.machineInEditIdValue

    let categorias = await this.categoryDetentionsService.getAll().toPromise()
    for (let cat of categorias) {
      if (cat.tipo == "programada") {
        this.paradasP.push(...(await this.machineService.getAllDetentionsByMachine(this.machineSelectedId, cat.id).toPromise()))
      }
    }
    if(this.data?.elm){
      console.log(this.data);
      this.paradaP = this.data?.elm.idparada
      this.frecuencia = this.data.elm.cadacuanto * 60
      this.duracion = this.data.elm.duracion * 60
    }

  }

  crear() {
    let req: any = {}
    req.duracion = (this.duracion / 60)
    req.cadacuanto = (this.frecuencia / 60)
    req.idparada = this.paradaP
    req.idmaquina = this.machineSelectedId
    console.log(req);
    this.maquinaMantService.create(req).subscribe(ok => {
      console.log(ok);
      this.dialogRef2.close(true)
    })
  }

  editar(){
    let req: any = {}
    req.id = this.data.elm.id
    req.duracion = (this.duracion / 60)
    req.cadacuanto = (this.frecuencia / 60)
    req.idparada = this.paradaP
    req.idmaquina = this.machineSelectedId

    this.maquinaMantService.update(req).subscribe(ok => {
      console.log(ok);
      this.dialogRef2.close(true)
    })
  }


}
