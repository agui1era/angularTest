import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '@environments/environment';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class OeeService {
  private dataManagerSubject: BehaviorSubject<any>;
  public dataManager: Observable<any>;

  constructor(private http: HttpClient) {
    this.dataManagerSubject = new BehaviorSubject<any>(null);
    this.dataManager = this.dataManagerSubject.asObservable();
  }

  oeeByMachine(idmachine) {
    return this.http.get<any[]>(`${environment.apiUrl}/oee/machine/${idmachine}`);
  }
  oeeByProcess(idprocess) {
    return this.http.get<any[]>(`${environment.apiUrl}/oee/process/${idprocess}`);
  }
  oeeByPlant(idplanta) {
    return this.http.get<any[]>(`${environment.apiUrl}/oee/plant/${idplanta}`);
  }
  analiticaOtMermas(filtros){
    return this.http.get<any[]>(`${environment.apiUrl}/analitica/ot/mermas${filtros?filtros:''}`);
  }

  analiticaOtPendings(filtros){
    return this.http.get<any[]>(`${environment.apiUrl}/analitica/ot/pendientes${filtros?filtros:''}`);
  }
  analiticaMantsPendings(filtros){
    return this.http.get<any[]>(`${environment.apiUrl}/analitica/mantenciones/pendientes${filtros?filtros:''}`);
  }

  analiticaAllParadas(filtros){
    return this.http.get<any[]>(`${environment.apiUrl}/analitica/paradas/all${filtros?filtros:''}`);
  }

  analiticaAllMants(filtros){
    return this.http.get<any[]>(`${environment.apiUrl}/analitica/mantenimientos/all${filtros?filtros:''}`);
  }

  analiticaIndicadores(){
    return this.http.get<any[]>(`${environment.apiUrl}/indicadores`);
  }

  analiticaIndicadoresPost(dataFiltro){
    return this.http.post<any[]>(`${environment.apiUrl}/indicadores`,dataFiltro);
  }


/*
  getTime() {
    return this.http.get<any[]>(`${environment.apiUrl}/the-time`);
  }

  getSettings() {
    return this.http.get<any[]>(`${environment.apiUrl}/settings`);
  }
  updateSettings(data) {
    return this.http.put<any[]>(`${environment.apiUrl}/settings`,data);
  }

  create(data) {
    return this.http.post<any[]>(`${environment.apiUrl}/hand-hour`,data);
  }

  delete(id) {
    return this.http.delete<any[]>(`${environment.apiUrl}/hand-hour/${id}`);
  }

  update(data) {
    return this.http.put<any[]>(`${environment.apiUrl}/hand-hour`,data);
  }
*/

}
