import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AlertDetentionComponent} from "@app/alert-detention/alert-detention.component";
import {InterruptionService} from "@app/_services/interruption.service";
import {Role, User} from "@app/_models";
import {AuthenticationService} from "@app/_services";
import {CategoryDetentionService} from '@app/_services/categoryDetention.service';
import {OrdenDeTrabajoService} from "@app/_services/ordenDeTrabajo.service";

@Component({
  selector: 'app-detalle-scheduler',
  templateUrl: './detalle-scheduler.component.html',
  styleUrls: ['./detalle-scheduler.component.sass']
})
export class DetalleSchedulerComponent implements OnInit {
  selectedCat: any = ""
  selectedName: any = ""
  inEdit = false
  oculto = false
  user: User;
  categorias = []
  esBajaVelocidad = false
  otObj: any = null
  cantidad:any = 0;
  minutos = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private interruptionService: InterruptionService,
    private dialogRef2: MatDialogRef<AlertDetentionComponent>,
    private authenticationService: AuthenticationService,
    private categoryDetentionsService: CategoryDetentionService,
    private ordenDeTrabajoService: OrdenDeTrabajoService
  ) {
  }

  ngOnInit(): void {
    console.log(this.data);
    let idordendetrabajo = null
    for (let i = this.data.m; i <= this.data.f; i++) {
      this.minutos.push(i)
      console.log(this.data.dataSensor[i < 10 ? '0' + i.toString() : i])
      if (this.data.dataSensor[i < 10 ? '0' + i.toString() : i]?.idordendetrabajo != null) {
        idordendetrabajo = this.data.dataSensor[i < 10 ? '0' + i.toString() : i]?.idordendetrabajo
      }

    }
    this.minutos.pop()
    this.cantidad = this.minutos.map(o => this.data.dataSensor[o < 10 ? '0' + o.toString() : o]).map(o => o.produccion).reduce((a, b) => +a + +b, 0)
    console.log(this.cantidad);
    console.log(idordendetrabajo);
    if (idordendetrabajo) {
      this.ordenDeTrabajoService.getById(idordendetrabajo).subscribe(okOt => {
        console.log(okOt);
        this.otObj = okOt
      })
    }
    this.esBajaVelocidad = this.data.info.tipo_parada.nombre == "Baja de velocidad"
    this.authenticationService.user.subscribe(x => this.user = x);
    this.selectedCat = parseInt(this.data.info.tipo_parada.idcategoriaparada_categoriadeparada?.id)
    this.selectedName = this.data.info.tipo_parada.nombre

    this.dialogRef2.disableClose = true
  }

  get isOperator() {
    return this.user && this.user.role === Role.operador;
  }

  closeModal() {
    this.dialogRef2.close(this.oculto)
  }

  openDetentions(dataInterrupcion) {
    console.log(dataInterrupcion)
    let req = {
      "idturno": JSON.parse(localStorage.getItem("activeTurn")).id,
      "interrupcion": dataInterrupcion.info.id,
      "initMin": dataInterrupcion.f
    }
    console.log(req);
    this.interruptionService.fusion(req).subscribe(okFusion => {
      console.log(okFusion);

      const dialogRef = this.dialog.open(AlertDetentionComponent, {
        data: {
          activeTurn: {},
          intInfo: {info: okFusion}
          //intInfo: this.data
        }

      })
      dialogRef.afterClosed().subscribe(result => {
        this.dialogRef2.close()
      });
    })
  }

  editar() {
    this.categoryDetentionsService.getAll().subscribe(allCategories => {
      this.categorias = allCategories
    })
  }

  confirmar() {
    this.inEdit = false
    let req = {
      idcategoriaparada: this.selectedCat,
      nombre: this.selectedName,
      id: this.data.info.id
    }

    this.interruptionService.confirm(req).subscribe(okConfirm => {
      console.log(okConfirm);
      this.interruptionService.getById(this.data.info.id).subscribe(okInt => {
        this.data.info = okInt
      })
    })

  }


}
