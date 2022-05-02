import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '@environments/environment';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class SuscripcionService {
  private dataTableSubject: BehaviorSubject<any[]>;
  public dataTable: Observable<any[]>;


  private dataManagerSubject: BehaviorSubject<any>;
  public dataManager: Observable<any>;
  entityPathName = "suscripcion"

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

  noLeidas(){
    this.getAll().subscribe(okNotifs =>{
      this.dataManagerSubject.next(okNotifs.filter(o=>o.fechaleido == null).length)

    })

  }

  getAll() {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}`);
  }

  suscribibles() {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}/suscribible`);
  }
  leer(id) {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}/leer/${id}`);
  }

  getByUserAndRole(data) {
    return this.http.post<any>(`${environment.apiUrl}/${this.entityPathName}/usuario`, data, {
      headers: {
        "content-type": "application/json"
      }
    });
  }

  suscribir(data) {
    return this.http.post<any>(`${environment.apiUrl}/${this.entityPathName}/suscribir`, data, {
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
}
