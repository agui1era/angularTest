import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ComentariootManagerComponent} from '@app/comentarioot-manager/comentarioot-manager.component';
import {ComenntariosotService} from "@app/_services/comenntariosot.service";
import {AlertDetentionComponent} from "@app/alert-detention/alert-detention.component";
import {AuthenticationService} from "@app/_services";
import {OrdenDeTrabajoMermaService} from "@app/_services/ordenDeTrabajoMerma.service";
import {MermasService} from "@app/_services/mermas.service";

@Component({
  selector: 'app-show-ot',
  templateUrl: './show-ot.component.html',
  styleUrls: ['./show-ot.component.sass']
})
export class ShowOTComponent implements OnInit {

  listaComentarios = []
  nombreCompletoUsuario = ""
  mermasDelaOT: any = []
  tiposMermas: any = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private comentariosotService: ComenntariosotService,
    private authenticationService: AuthenticationService,
    private ordenDeTrabajoMermaService: OrdenDeTrabajoMermaService,
    private mermasService: MermasService,

  ) {
  }

  async ngOnInit(): Promise<void> {
    console.log(this.data);
    console.log(this.listaComentarios);
    await this.cargarComments()
    this.tiposMermas = await  this.mermasService.getAll().toPromise()
    let okMermasOT = await this.obtenerMermasDelaOT()
    this.mermasDelaOT = okMermasOT
    console.log(okMermasOT);
  }
  crearMermaOT(tipomerma, cantidad) {
    this.ordenDeTrabajoMermaService.create({
      idordendetrabajo: this.data.id,
    }).subscribe(okCreated => {
      console.log(okCreated);
      this.obtenerMermasDelaOT().then(okMermasOT => {
        this.mermasDelaOT = okMermasOT
        console.log(okMermasOT);
      })
    })
  }

  guardarMermas() {
    console.log(this.mermasDelaOT);
    for (let nMot of this.mermasDelaOT) {
      this.ordenDeTrabajoMermaService.update(nMot).subscribe(okUpd => {
        console.log(okUpd);
      })
    }
  }

  eliminarMerma(id) {
    this.ordenDeTrabajoMermaService.delete(id).subscribe(okDel => {
      this.obtenerMermasDelaOT().then(okMermasOT => {
        this.mermasDelaOT = okMermasOT
        console.log(okMermasOT);
      })
    })
  }

  obtenerMermasDelaOT() {
    return this.ordenDeTrabajoMermaService.getAllByOT(this.data.id).toPromise()
  }
  async cargarComments() {
    this.listaComentarios = await this.comentariosotService.getByIdOT(this.data.id).toPromise()
    let userData = await this.authenticationService.info().toPromise()
    this.nombreCompletoUsuario = `${userData.okUser.nombre} ${userData.okUser.apellido}`
  }

  async borrar(id){
    await this.comentariosotService.delete(id).toPromise()
    await this.cargarComments()
  }

  async openCreateComment(idordendetrabajo) {
    const dialogRef = this.dialog.open(ComentariootManagerComponent, {data: idordendetrabajo})

    await dialogRef.afterClosed().toPromise()
    await this.cargarComments()
  }



}
