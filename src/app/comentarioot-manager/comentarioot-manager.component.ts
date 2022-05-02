import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ComenntariosotService} from "@app/_services/comenntariosot.service";

@Component({
  selector: 'app-comentarioot-manager',
  templateUrl: './comentarioot-manager.component.html',
  styleUrls: ['./comentarioot-manager.component.sass']
})
export class ComentariootManagerComponent implements OnInit {
  inputComentario:any = ""
  constructor(
    private dialogRef2: MatDialogRef<ComentariootManagerComponent>,
    private comentariosotService:ComenntariosotService,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
  }
  agregarComentario(){
    let req = {
      idordendetrabajo : this.data,
      comentario:this.inputComentario
    }

    console.log(req);
    this.comentariosotService.create(req)
      .subscribe(okComments =>{
        this.dialogRef2.close()

      })
  }
}
