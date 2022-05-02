import {Component, Inject, OnInit} from '@angular/core';
import {OrdenDeTrabajoService} from "@app/_services/ordenDeTrabajo.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MaintenanceManagerComponent} from "@app/maintenance-manager/maintenance-manager.component";
import {Role, User} from "@app/_models";
import {AuthenticationService} from "@app/_services";

@Component({
  selector: 'app-asociar-orden-turno-pasado',
  templateUrl: './asociar-orden-turno-pasado.component.html',
  styleUrls: ['./asociar-orden-turno-pasado.component.sass']
})
export class AsociarOrdenTurnoPasadoComponent implements OnInit {

  turno: any = ""
  machineId: any = ""
  loading = false;
  allOrdenesDeTrabajo = []
  user: User;

  constructor(
    private ordenDeTrabajoService: OrdenDeTrabajoService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef2: MatDialogRef<AsociarOrdenTurnoPasadoComponent>,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,

  ) {
  }

  ngOnInit(): void {
    this.authenticationService.user.subscribe(x => this.user = x);

    this.turno = JSON.parse(localStorage.getItem("activeTurn"))
    console.log(this.turno);
    this.machineId = this.turno.idmaquina
    this.recargarOT()
  }

  recargarOT() {
    this.loading = true
    this.ordenDeTrabajoService.getByMaquina(this.machineId).subscribe(okOrders => {
      this.allOrdenesDeTrabajo = okOrders.filter(o => this.data.listaPt.find(oo => oo.idordendetrabajo == o.id) == undefined)
      this.loading = false
    })
  }

  afueraFunc(fin = () => {
  }) {
    console.log("aaa")
    return fin()
  }
  get isOperator() {
    return this.user && this.user.role === Role.operador;
  }
  asociar(ot) {
    this.ordenDeTrabajoService.sumar({
      idordendetrabajo:ot.id,
      idturno:this.turno.id
    })
    this.ordenDeTrabajoService.asociar({
      idturno: this.turno.id,
      idordendetrabajo: ot.id
    }).subscribe(ok => {
      console.log(ok);
      this.dialogRef2.close()
    })
  }

  openCreateMaintenance() {
    this.dialog.open(MaintenanceManagerComponent, {
      data: {operador: true, maquina: this.machineId,close:true}
    }).afterClosed().subscribe(ok => {
      this.recargarOT()
    })
  }
}
