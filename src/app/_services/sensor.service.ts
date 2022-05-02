import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '@environments/environment';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class SensorService {

  private dataTableSubject: BehaviorSubject<any[]>;
  public dataTable: Observable<any[]>;


  private dataManagerSubject: BehaviorSubject<any>;
  public dataManager: Observable<any>;
  entityPathName = "categoriasensor"

  constructor(private http: HttpClient) {
    this.dataManagerSubject = new BehaviorSubject<any>(null);
    this.dataManager = this.dataManagerSubject.asObservable();
    this.dataTableSubject = new BehaviorSubject<any[]>(null);
    this.dataTable = this.dataTableSubject.asObservable();
  }

  async refreshDataTable() {
    this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}`).subscribe((ok: any) => {
      this.dataTableSubject.next(ok)
    })
  }

  dataManagerChangeValue(value) {
    this.dataManagerSubject.next(value)
  }

  getRegisteredByMachine(id){
    return this.http.get<any[]>(`${environment.apiUrl}/sensor/maquina/${id}`);

  }

  getAllRegistered() {
    return this.http.get<any[]>(`${environment.apiUrl}/sensor/registered`);
  }
  getAllUnregistered() {
    return this.http.get<any[]>(`${environment.apiUrl}/sensor/unregistered`);
  }
  getAll() {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}`);
  }

  getById(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/${this.entityPathName}/${id}`);
  }

  create(data) {
    return this.http.post<any>(`${environment.apiUrl}/${this.entityPathName}`, data, {
      headers: {
        "content-type": "application/json"
      }
    });
  }

  update(data) {
    return this.http.put<any>(`${environment.apiUrl}/${this.entityPathName}`, data, {
      headers: {
        "content-type": "application/json"
      }
    });
  }
  delete(data) {
    return this.http.delete<any>(`${environment.apiUrl}/${this.entityPathName}/${data.id}`, {
      headers: {
        "content-type": "application/json"
      }
    });
  }

  getProdByTurn(idturno) {
    return this.http.get<any[]>(`${environment.apiUrl}/sensor/turn/${idturno}`);
  }
  getMermaProdByTurn(idturno) {
    return this.http.get<any[]>(`${environment.apiUrl}/sensor/merma/turn/${idturno}`);
  }
  getProdByTurnByCategory(idturno,idcategoria) {
    return this.http.get<any[]>(`${environment.apiUrl}/sensor/category/${idcategoria}/turn/${idturno}`);
  }

  getProdByTurnAndHour(idturno,hour) {
    return this.http.get<any[]>(`${environment.apiUrl}/sensor/turn/${idturno}/${hour}`);
  }
  registerSensor(data){
    return this.http.post<any>(`${environment.apiUrl}/sensor/register`, data, {
      headers: {
        "content-type": "application/json"
      }
    });
  }
  asociarMaquina(data){
    return this.http.post<any>(`${environment.apiUrl}/sensor/maquina`, data, {
      headers: {
        "content-type": "application/json"
      }
    });
  }


}
