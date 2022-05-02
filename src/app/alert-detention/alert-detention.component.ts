import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CategoryDetentionService} from "@app/_services/categoryDetention.service";
import {TurnService} from "@app/_services/turn.service";
import {MachineService} from "@app/_services/machine.service";
import {InterruptionService} from "@app/_services/interruption.service";
import {SelectAlertDetentionComponent} from "@app/select-alert-detention/select-alert-detention.component";
import {InterruptionManagerComponent} from "@app/interruption-manager/interruption-manager.component";
import * as moment from 'moment';

@Component({
  selector: 'app-alert-detention',
  templateUrl: './alert-detention.component.html',
  styleUrls: ['./alert-detention.component.sass']
})
export class AlertDetentionComponent implements OnInit {

  enEspera = false

  allCategories = []
  activeTurn: any = {}
  allDetentionsList = []
  allInterruptions = []
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryServices: CategoryDetentionService,
    private turnService: TurnService,
    private machineService: MachineService,
    private interruptionService: InterruptionService,
    private dialog: MatDialog,
    private dialogRef2: MatDialogRef<AlertDetentionComponent>,

  ) {
  }

  ngOnInit(): void {
    this.cargarDatosCategoriasEInterrupcionesExistentes()
    this.activeTurn = this.turnService.activeTurnsValue[0]
    console.log(this.activeTurn);
  }

  cargarDatosCategoriasEInterrupcionesExistentes() {
    this.loading = true
    this.categoryServices.getAll().subscribe(ok => {
      this.interruptionService.getByMachine(this.activeTurn.idturno_turno.idmaquina,this.activeTurn.idturno_turno.id).subscribe(okInterruptions => {
        this.allInterruptions = okInterruptions
        this.allCategories = ok
        console.log(okInterruptions);
        console.log(ok);
        this.allCategories = ok.map(o => {
          return {
            ...o,
            existe: this.allInterruptions.find(oo => {
              return oo.tipo_parada.idcategoriaparada == o.id && oo.duracion == 0
            }) ? true : false
          }
        })
        if(this.allCategories.find(o=>o.existe)){
          this.enEspera = this.allCategories.find(o=>o.existe)
        }

        this.loading = false
        console.log(this.allCategories);
      })
    })
  }

  terminarActual(cat) {
    this.loading = true
    let mchn = this.activeTurn.idturno_turno.idmaquina
    console.log(this.allInterruptions);
    let exst = this.allInterruptions.find(o => o.tipo_parada.idcategoriaparada == cat.id && o.duracion == 0)
    console.log(exst);
    console.log(Date.now())

    var startTime = moment(exst.horainicio);
    var endTime = moment(Date.now());

    let req = {
      "id": exst.id,
      "duracion": endTime.diff(startTime, 'seconds'),
    }
    console.log(req);
    this.interruptionService.update(req).subscribe(updatedInterruptin => {
      console.log(updatedInterruptin);
      this.enEspera = false
      this.cargarDatosCategoriasEInterrupcionesExistentes()
    })

  }


  crearAlerta(cat) {
    const dialogRef = this.dialog.open(SelectAlertDetentionComponent,
      {
        data: {
          activeTurn: this.activeTurn,
          category: cat,
          intInfo:this.data.intInfo,
          duracion:this.data.duracion,
          fechaI:this.data.fechaI
        }
      })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef2.close(true)
      }
      //this.cargarDatosCategoriasEInterrupcionesExistentes()
    });
  }

}
