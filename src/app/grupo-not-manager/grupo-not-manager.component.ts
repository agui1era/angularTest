import { Component, OnInit } from '@angular/core';
import {SuscripcionService} from "@app/_services/suscripciones.service";

@Component({
  selector: 'app-grupo-not-manager',
  templateUrl: './grupo-not-manager.component.html',
  styleUrls: ['./grupo-not-manager.component.sass']
})
export class GrupoNotManagerComponent implements OnInit {
  listaSuscribibles:any = []

  constructor(
    private suscripcionService: SuscripcionService

  ) { }

  async ngOnInit(): Promise<void> {
    this.listaSuscribibles = await this.suscripcionService.suscribibles().toPromise()

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

}
