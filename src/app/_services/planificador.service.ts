import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {BehaviorSubject, Observable, Subject} from "rxjs";
import {environment} from "@environments/environment";

@Injectable({providedIn: 'root'})
export class PlanificadorService {
  private dataTableSubject: BehaviorSubject<any[]>;
  public dataTable: Observable<any[]>;


  private dataManagerSubject: BehaviorSubject<any>;
  public dataManager: Observable<any>;
  entityPathName = "planificacion"

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
}
