import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '@environments/environment';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class ReportesService {
  private dataTableSubject: BehaviorSubject<any[]>;
  public dataTable: Observable<any[]>;


  private dataManagerSubject: BehaviorSubject<any>;
  public dataManager: Observable<any>;
  entityPathName = "reportes"

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
    return this.http.get(`${environment.apiUrl}/${this.entityPathName}`);
  }

  getBySp(id,lapso,otro = '') {
    return this.http.get<any>(`${environment.apiUrl}/${this.entityPathName}/${id}?lapso=${lapso}&otro=${otro}`);
  }

  getByMaq(id,lapso,otro = '',idsp=null) {
    return this.http.get<any>(`${environment.apiUrl}/${this.entityPathName}/maquina/${id}?lapso=${lapso}&otro=${otro}${idsp ? '&idsp='+idsp:''}`);
  }

  getByProc(id,lapso,otro = '') {
    return this.http.get<any>(`${environment.apiUrl}/${this.entityPathName}/proceso/${id}?lapso=${lapso}&otro=${otro}`);
  }

  getByPlant(id,lapso,otro = '') {
    return this.http.get<any>(`${environment.apiUrl}/${this.entityPathName}/planta/${id}?lapso=${lapso}&otro=${otro}`);
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
