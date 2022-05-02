import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SuscripcionService} from "@app/_services/suscripciones.service";

@Component({
  selector: 'app-notify-suscriptions-manager',
  templateUrl: './notify-suscriptions-manager.component.html',
  styleUrls: ['./notify-suscriptions-manager.component.sass']
})
export class NotifySuscriptionsManagerComponent implements OnInit {

  listaSuscribibles:any = []
  suscripcionesUsuario = []
  loading = false
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef2: MatDialogRef<NotifySuscriptionsManagerComponent>,
    private suscripcionService: SuscripcionService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.suscripcionesUsuario = await this.suscripcionService.getByUserAndRole({idUser:this.data.usr.id,role:this.data.usr.role}).toPromise()
    this.listaSuscribibles = await this.suscripcionService.suscribibles().toPromise()
    console.log(this.suscripcionesUsuario);
    for(let pl of this.listaSuscribibles){
      for(let pr of pl.procesos){
        for(let maq of pr.maquinas){
          for(let sus of maq.suscribibles){
            console.log(sus);
            let susEncontrada = this.suscripcionesUsuario.find(o=>o.idmaquina == maq.id && o.idtiposuscripcion == sus.id)
            if(susEncontrada){
              console.log(susEncontrada)
              sus.activo = true
            }

          }
        }
      }
    }


  }

  someComplete(maq,lista,tipo) {
    if (lista == null) {
      return false;
    }
    return lista.filter(t => t.activo && t.tipo == tipo).length > 0 && !maq[tipo] ;

  }

  someCompleteMaquina(maq,lista) {
    if (lista == null) {
      return false;
    }
    return lista.filter(t => t.activo).length > 0 && !maq.all ;

  }
  someCompleteProceso(pr,lista) {
    if (lista == null) {
      return false;
    }
    return lista.filter(t => t.all).length > 0 && !pr.all ;

  }
  someCompletePlanta(pl,lista) {
    if (lista == null) {
      return false;
    }
    return lista.filter(t => t.all).length > 0 && !pl.all ;

  }
  updateAllComplete(pr,maq,lista,tipo) {
    maq[tipo] = lista != null && lista.filter(t => t.tipo == tipo).every(t => t.activo);
    maq['all'] = lista != null && lista.every(t => t.activo);
    //pr['all'] = pr.maquinas != null && pr.maquinas.every(t => t.all);

  }

  setAll(pr,evnt,maq,lista,tipo) {
    maq[tipo] = evnt;
    if (lista == null) {
      return;
    }
    lista.filter(t => t.tipo == tipo).forEach(t => (t.activo = evnt));
    maq['all'] = lista != null && lista.every(t => t.activo);
    pr['all'] = pr.maquinas != null && pr.maquinas.every(t => t.all);

  }
  setAllMaquina(pr,evnt,maq,lista) {
    maq['all'] = evnt;
    maq['Mantencion'] = evnt
    maq['Orden de trabajo'] = evnt
    maq['Paradas'] = evnt
    maq['Informativa'] = evnt
    if (lista == null) {
      return;
    }
    lista.forEach(t => (t.activo = evnt));
    pr['all'] = pr.maquinas != null && pr.maquinas.every(t => t.all);

  }
  setAllPrdoceso(pl,evnt,pr,lista) {
    pr['all'] = evnt;
    if (lista == null) {
      return;
    }
    lista.forEach(t => {

      t.all = evnt
      this.setAllMaquina(pr,evnt,t,t.suscribibles)
    });
    pl['all'] = pl.procesos != null && pl.procesos.every(t => t.all);

  }
  setAllPlanta(evnt,pl,lista) {
    pl['all'] = evnt;
    if (lista == null) {
      return;
    }
    lista.forEach(t => {
      t.all = evnt
      this.setAllPrdoceso(pl,evnt,t,t.maquinas)
    });
  }
  async guardarConf(){
    this.loading = true
    let suscribibles = this.listaSuscribibles.map(o=>o.procesos.map(oo=>oo.maquinas.map(ooo=>ooo.suscribibles.map(oooo=>{return {idUser:this.data.usr.id,role:this.data.usr.role,idmaquina:ooo.id,idtiposuscripcion:oooo.id,activo:oooo.activo}}))))
    suscribibles = suscribibles.flat(3)
    for(let sus of suscribibles) {
      console.log(sus);
      await this.suscripcionService.suscribir(sus).toPromise()
    }
    this.loading = false
    this.dialogRef2.close(true)

  }

}
