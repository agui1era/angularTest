import {Component, Inject, OnInit} from '@angular/core';
import {TurnService} from "@app/_services/turn.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SensorService} from "@app/_services/sensor.service";
import {OrdenDeTrabajoService} from "@app/_services/ordenDeTrabajo.service";
import {OrdenDeTrabajoMermaService} from "@app/_services/ordenDeTrabajoMerma.service";
import {MermasService} from "@app/_services/mermas.service";
import {ok} from 'assert';

@Component({
  selector: 'app-mermas-manager',
  templateUrl: './mermas-manager.component.html',
  styleUrls: ['./mermas-manager.component.sass']
})
export class MermasManagerComponent implements OnInit {
  inputMermas = 0
  scrapSensor: any = 0
  residuosOT: any = 0
  activeOtPt: any = {}
  scrapTotal: any = 0
  scrapSupervisor: any = 0
  CISensor: any = 0
  CFSensor: any = 0
  startedTurn: any = {}
  reTrabajo: any = 0
  tiposMermas: any = []

  mermasDelaOT: any = []

  constructor(
    private turnService: TurnService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MermasManagerComponent>,

    private sensorService: SensorService,
    private ordenDeTrabajoService: OrdenDeTrabajoService,
    private ordenDeTrabajoMermaService: OrdenDeTrabajoMermaService,
    private mermasService: MermasService,

  ) {
  }

  ngOnInit(): void {
    if (this.data) {
      this.inputMermas = this.data.mermas
    }
    this.startedTurn = JSON.parse(localStorage.getItem("activeTurn"))
    this.activeOtPt = JSON.parse(localStorage.getItem("activeOTpt"))
    this.residuosOT = this.activeOtPt.idordendetrabajo_ordendetrabajo.residuos
    this.mermasService.getAll().subscribe(okMermas => {
      console.log(okMermas);
      this.tiposMermas = okMermas
    })
    if (this.activeOtPt.idordendetrabajo) {
      this.obtenerMermasDelaOT().then(okMermasOT => {
        this.mermasDelaOT = okMermasOT
        console.log(okMermasOT);
        this.calcularScrapSupervisor()

      })
    }
    this.obtenerScrap().then(mermaSensorScrap => {
      console.log(mermaSensorScrap);
      this.scrapSensor = mermaSensorScrap.map(o => o.produccion).reduce((a, b) => +a + +b, 0)
      console.log("this.scrapSensor", this.scrapSensor);
      this.obtenerCF().then(sensorData => {
        console.log(sensorData);
        this.CFSensor = sensorData.map(o => o.produccion).reduce((a, b) => +a + +b, 0)
        console.log("this.CFSensor", this.CFSensor);

      })
      this.obtenerCI().then(sensorData => {
        console.log(sensorData);
        this.CISensor = sensorData.map(o => o.produccion).reduce((a, b) => +a + +b, 0)
        console.log("this.CISensor", this.CISensor);
        this.scrapTotal = this.CFSensor - this.scrapSensor
        console.log("this.scrapTotal", this.scrapTotal);
        this.reTrabajo = this.CFSensor - (this.CISensor - this.scrapSensor)
      })

    })


  }


  obtenerScrap() {
    return this.sensorService.getMermaProdByTurn(this.startedTurn.id).toPromise()
  }

  obtenerCF() {
    return this.sensorService.getProdByTurn(this.startedTurn.id).toPromise()
  }

  obtenerCI() {
    return this.sensorService.getProdByTurnByCategory(this.startedTurn.id, 1).toPromise()
  }

  crearMermaOT(tipomerma, cantidad) {
    this.ordenDeTrabajoMermaService.create({
      idordendetrabajo: this.activeOtPt.idordendetrabajo,
    }).subscribe(okCreated => {
      console.log(okCreated);
      this.obtenerMermasDelaOT().then(okMermasOT => {
        this.mermasDelaOT = okMermasOT
        console.log(okMermasOT);
        this.calcularScrapSupervisor()
      })
    })
  }

  guardarMermas() {
    console.log(this.mermasDelaOT);
    for (let nMot of this.mermasDelaOT) {
      this.ordenDeTrabajoMermaService.update(nMot).subscribe(okUpd => {
        console.log(okUpd);
        this.dialogRef.close(true)
      })
    }
  }

  eliminarMerma(id) {
    this.ordenDeTrabajoMermaService.delete(id).subscribe(okDel => {
      this.obtenerMermasDelaOT().then(okMermasOT => {
        this.mermasDelaOT = okMermasOT
        console.log(okMermasOT);
        this.calcularScrapSupervisor()
      })
    })
  }

  asignarResiduos() {
    this.ordenDeTrabajoService.update({
      id: this.activeOtPt.idordendetrabajo,
      residuos: this.residuosOT
    }).subscribe(okUpdateOT => {
      console.log(okUpdateOT);
    })
  }

  calcularScrapSupervisor() {
    this.scrapSupervisor = this.mermasDelaOT.map(o => o.cantidad).reduce((a, b) => +a + +b, 0)
  }

  obtenerMermasDelaOT() {
    return this.ordenDeTrabajoMermaService.getAllByOT(this.activeOtPt.idordendetrabajo).toPromise()
  }


  /*  async cambiarMermas(){
      let req = {
        mermas:this.data.mermas,
        id:this.data.id
      }
      console.log(req);
      this.turnService.updateProductTurnByTurn(req).subscribe(ok=>{
        console.log(ok);
        this.dialogRef.close()
      })
    }*/


}
