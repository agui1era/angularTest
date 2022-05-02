import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '@environments/environment';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {User} from "@app/_models";
import * as moment from "moment";
import {SettingsService} from "@app/_services/settings.service";

@Injectable({providedIn: 'root'})
export class TurnService {

  private dataManagerSubject: BehaviorSubject<any>;
  public dataManager: Observable<any>;

  private dataHorarioManagerSubject: BehaviorSubject<any>;
  public dataHorarioManager: Observable<any>;

  private dataAllowedHoursManagerSubject: BehaviorSubject<any>;
  public dataAllowedHoursManager: Observable<any>;


  private dataActiveTurnsManagerSubject: BehaviorSubject<any>;
  public dataActiveTurnsManager: Observable<any>;

  private activeTurnObjManagerSubject: BehaviorSubject<any>;
  public activeTurnObjManager: Observable<any>;


  private tablaProdSubject: BehaviorSubject<any>;
  public tablaProd: Observable<any>;


  entityPathName = "turn"

  constructor(private http: HttpClient, private settingsService: SettingsService) {

    this.dataManagerSubject = new BehaviorSubject<any>(false);
    this.dataManager = this.dataManagerSubject.asObservable();
    this.dataHorarioManagerSubject = new BehaviorSubject<any>(null);
    this.dataHorarioManager = this.dataHorarioManagerSubject.asObservable();
    this.dataActiveTurnsManagerSubject = new BehaviorSubject<any>([]);
    this.dataActiveTurnsManager = this.dataActiveTurnsManagerSubject.asObservable();
    this.tablaProdSubject = new BehaviorSubject<any>(null);
    this.tablaProd = this.tablaProdSubject.asObservable();
    this.dataAllowedHoursManagerSubject = new BehaviorSubject<any>([]);
    this.dataAllowedHoursManager = this.dataAllowedHoursManagerSubject.asObservable();
    this.activeTurnObjManagerSubject = new BehaviorSubject<any>({});
    this.activeTurnObjManager = this.activeTurnObjManagerSubject.asObservable();
  }

  async refreshActiveTurns() {
    this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}/pending`).subscribe((ok: any) => {
      this.dataActiveTurnsManagerSubject.next(ok)
      if (ok.length >= 1) {
        localStorage.setItem("pendingTurns", JSON.stringify(ok))
        let isActiveTurnObj = ok[0]
        this.activeTurnObjManagerChangeValue(isActiveTurnObj.idturno_turno)
      }
    })
  }

  async refreshActiveTurn() {
    if (JSON.parse(localStorage.getItem("activeTurn")).idmaquina) {
      let turnInited = await this.http
        .get<any>(`${environment.apiUrl}/${this.entityPathName}/machine/${
          JSON.parse(localStorage.getItem("activeTurn")).idmaquina}`).toPromise();
      console.log(turnInited);
      localStorage.setItem("activeTurn", JSON.stringify(turnInited[0]))
    }
  }

  recargarHorasPermitidas() {

    this.settingsService.getTime().subscribe((timeSv: any) => {
      let horaSv = timeSv.time
      let fecha = this.activeTurnObjManagerValue.horafin == null ? new Date(parseInt(horaSv.toString())) : new Date(this.activeTurnObjManagerValue.horafin)

      function subirHora(fechaI, alm) {
        if (fechaI.getTime() > fecha.getTime()) {
          return false
        } else {
          let horaSumada = moment(fechaI)
          alm.push(horaSumada.format("HH:mm"))
          horaSumada.add(1, 'hours')
          subirHora(horaSumada.toDate(), alm)
        }
      }

      let listHoursFull = []
      let horaTurno = new Date(this.activeTurnObjManagerValue.horainicio).getHours()
      let fechaInitial = new Date(this.activeTurnObjManagerValue.horainicio)
      subirHora(fechaInitial, listHoursFull)
      listHoursFull.pop()
      if (this.activeTurnObjManagerValue.horafin == null) {
        listHoursFull.push(moment(fecha).format("HH:mm"))
      } else {
      }
      this.dataAllowedHoursManagerChangeValue(listHoursFull)


    })
  }


  dataActiveTurnsManagerChangeValue(value) {
    this.dataActiveTurnsManagerSubject.next(value)
  }

  dataAllowedHoursManagerChangeValue(value) {
    this.dataAllowedHoursManagerSubject.next(value)
  }

  activeTurnObjManagerChangeValue(value) {
    this.activeTurnObjManagerSubject.next(value)
  }

  dataManagerChangeValue(value) {
    this.dataManagerSubject.next(value)
  }

  tablaProdChangeValue(value) {
    this.tablaProdSubject.next(value)
  }

  dataHorarioManagerChangeValue(value) {
    this.dataHorarioManagerSubject.next(value)
  }

  public get horarioValue() {
    return this.dataHorarioManagerSubject.value;
  }

  public get dataAllowedHoursManagerValue() {
    return this.dataAllowedHoursManagerSubject.value;
  }

  public get activeTurnObjManagerValue() {
    return this.activeTurnObjManagerSubject.value;
  }


  public get tablaProdValue() {
    return this.tablaProdSubject.value;
  }

  public get activeTurnsValue() {
    return this.dataActiveTurnsManagerSubject.value;
  }

  initOne(data, no = true) {
    if (no) {
      localStorage.removeItem("pt")
      localStorage.removeItem("sp")
    }

    return this.http.put<any>(`${environment.apiUrl}/${this.entityPathName}/init/${data.id}`, {horario: data.horario}, {
      headers: {
        "content-type": "application/json"
      }
    });
  }

  initOneOT(data, no = true) {
    if (no) {
      localStorage.removeItem("pt")
      localStorage.removeItem("sp")
    }

    return this.http.put<any>(`${environment.apiUrl}/${this.entityPathName}/init/${data.id}`, {idordendetrabajo: data.idordendetrabajo}, {
      headers: {
        "content-type": "application/json"
      }
    });
  }

  end(id) {
    return this.http.patch<any>(`${environment.apiUrl}/${this.entityPathName}/end/${id}`, {}, {
      headers: {
        "content-type": "application/json"
      }
    });
  }

  getPendings() {
    return this.http.get<any>(`${environment.apiUrl}/${this.entityPathName}/pending`);
  }


  getAllProductTurns() {
    return this.http.get<any>(`${environment.apiUrl}/${this.entityPathName}/all/productturn`);
  }


  getTurnOfTodayByMachine(idMachine) {
    return this.http.get<any>(`${environment.apiUrl}/${this.entityPathName}/machine/${idMachine}`);
  }

  getTurnInitiatedByMachine(idMachine) {
    return this.http.get<any>(`${environment.apiUrl}/${this.entityPathName}/initiated/${idMachine}`);
  }

  getProductionByProductTurn(id) {
    return this.http.get<any>(`${environment.apiUrl}/${this.entityPathName}/production/machine/${id}`);
  }

  getProductTurnByTurn(id) {
    return this.http.get<any>(`${environment.apiUrl}/${this.entityPathName}/product/machine/${id}`);
  }
  getOperatorsByTurn(id) {
    return this.http.get<any>(`${environment.apiUrl}/${this.entityPathName}/operators/${id}`);
  }

  getAllProductionsByTurn(id) {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}/production/${id}`, {observe: 'response'});
  }

  createProductionByProductTurn(data) {
    return this.http.post<any>(`${environment.apiUrl}/${this.entityPathName}/production`, data, {
      headers: {
        "content-type": "application/json"
      }
    });
  }

  createProductTurnByTurn(data) {
    return this.http.post<any>(`${environment.apiUrl}/${this.entityPathName}/product`, data, {
      headers: {
        "content-type": "application/json"
      }
    });
  }

  updateTurn(data) {
    return this.http.put<any>(`${environment.apiUrl}/${this.entityPathName}`, data, {
      headers: {
        "content-type": "application/json"
      }
    });
  }

  updateProductTurnByTurn(data) {
    return this.http.put<any>(`${environment.apiUrl}/${this.entityPathName}/product`, data, {
      headers: {
        "content-type": "application/json"
      }
    });
  }

  deleteProductTurn(id) {
    return this.http.delete<any>(`${environment.apiUrl}/${this.entityPathName}/product/${id}`, {
      headers: {
        "content-type": "application/json"
      }
    });
  }

  deleteProduction(id) {
    return this.http.delete<any>(`${environment.apiUrl}/${this.entityPathName}/production/${id}`, {
      headers: {
        "content-type": "application/json"
      }
    });
  }


}
