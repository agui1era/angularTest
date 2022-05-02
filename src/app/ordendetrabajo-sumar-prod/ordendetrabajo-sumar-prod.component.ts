import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { OrdenDeTrabajoService } from '@app/_services/ordenDeTrabajo.service';

@Component({
  selector: 'app-ordendetrabajo-sumar-prod',
  templateUrl: './ordendetrabajo-sumar-prod.component.html',
  styleUrls: ['./ordendetrabajo-sumar-prod.component.sass']
})
export class OrdendetrabajoSumarProdComponent implements OnInit {
  totalProduccion = 0
  idturno:any = ""
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ordenDeTrabajoService: OrdenDeTrabajoService,
    private dialogRef: MatDialogRef<OrdendetrabajoSumarProdComponent>,

  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.idturno = JSON.parse(localStorage.getItem("Active"))
    console.log(this.data.listaDetProd.filter(o=>o.idprodturn==this.data.pt.id));
    this.totalProduccion = this.data.listaDetProd.filter(o=>o.idprodturn_productoturno.idordendetrabajo ==this.data.pt.idordendetrabajo).map(o=>o.cantidad || 0)
      .reduce((a, b) =>+a + +b,0)
  }
  sumar(idordendetrabajo){
    this.ordenDeTrabajoService.sumar({
      idordendetrabajo,
      idturno:this.data.idturno
    }).subscribe(ok=>{
      this.dialogRef.close()
    })
  }

}
