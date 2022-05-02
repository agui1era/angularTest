import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '@environments/environment';
import {User} from '@app/_models';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class UserService {

  private dataTableSubject: BehaviorSubject<any[]>;
  public dataTable: Observable<any[]>;

  private dataManagerSubject: BehaviorSubject<User>;
  public dataManager: Observable<any>;

  entityPathName = "user"



  constructor(private http: HttpClient) {
    this.dataManagerSubject = new BehaviorSubject<User>(null);
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
    return this.http.get<User[]>(`${environment.apiUrl}/${this.entityPathName}`);
  }

  getById(id: number) {
    return this.http.get<User>(`${environment.apiUrl}/${this.entityPathName}/${id}`);
  }

  create(data) {
    return this.http.post<User>(`${environment.apiUrl}/${this.entityPathName}`, data, {
      headers: {
        "content-type": "application/json"
      }
    });
  }

 update(data) {
    return this.http.put<User>(`${environment.apiUrl}/${this.entityPathName}`, data, {
      headers: {
        "content-type": "application/json"
      }
    });
  }
 recovery(data) {
    return this.http.put<User>(`${environment.apiUrl}/${this.entityPathName}/recovery`, data, {
      headers: {
        "content-type": "application/json"
      }
    });
  }

 delete(data) {
    console.log(data);
    return this.http.delete<User>(`${environment.apiUrl}/${this.entityPathName}/${data.usuario}`, {
      headers: {
        "content-type": "application/json"
      }
    });
  }
}
