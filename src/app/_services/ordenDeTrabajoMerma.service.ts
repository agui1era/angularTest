import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '@environments/environment';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class OrdenDeTrabajoMermaService {
  private dataTableSubject: BehaviorSubject<any[]>;
  public dataTable: Observable<any[]>;


  private dataManagerSubject: BehaviorSubject<any>;
  public dataManager: Observable<any>;
  entityPathName = "turnomermas"

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


  getAll() {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}`);
  }

  getAllByOT(idordendetrabajo) {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}/ordendetrabajo/${idordendetrabajo}`);
  }
  getByMaquina(id) {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}/maquina/${id}`);
  }
  finishOT(id) {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}/finish/${id}`);
  }

  getById(id) {
    return this.http.get<any>(`${environment.apiUrl}/${this.entityPathName}/id/${id}`);
  }

  create(data) {
    return this.http.post<any>(`${environment.apiUrl}/${this.entityPathName}`, data, {
      headers: {
        "content-type": "application/json"
      }
    });
  }
  asociar(data) {
    return this.http.post<any>(`${environment.apiUrl}/${this.entityPathName}/asociar`, data, {
      headers: {
        "content-type": "application/json"
      }
    });
  }
  sumar(data) {
    return this.http.post<any>(`${environment.apiUrl}/${this.entityPathName}/sumar`, data, {
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
  init(data) {
    return this.http.put<any>(`${environment.apiUrl}/${this.entityPathName}/init`, data, {
      headers: {
        "content-type": "application/json"
      }
    });
  }
  pause(data) {
    return this.http.put<any>(`${environment.apiUrl}/${this.entityPathName}/pause`, data, {
      headers: {
        "content-type": "application/json"
      }
    });
  }
  delete(id) {
    return this.http.delete<any>(`${environment.apiUrl}/${this.entityPathName}/${id}`, {
      headers: {
        "content-type": "application/json"
      }
    });
  }
}
