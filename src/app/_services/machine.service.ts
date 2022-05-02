import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '@environments/environment';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class MachineService {

  private dataTableSubject: BehaviorSubject<any[]>;
  public dataTable: Observable<any[]>;

  private machineProductsSubject: BehaviorSubject<any[]>;
  public machineProducts: Observable<any[]>;

  private machineDetentionsSubject: BehaviorSubject<any[]>;
  public machineDetentions: Observable<any[]>;

  private machineInEditIdSubject: BehaviorSubject<any[]>;
  public machineInEditId: Observable<any[]>;

  private dataManagerSubject: BehaviorSubject<any>;
  public dataManager: Observable<any>;
  entityPathName = "machine"

  constructor(private http: HttpClient) {
    this.dataManagerSubject = new BehaviorSubject<any>(null);
    this.dataManager = this.dataManagerSubject.asObservable();
    this.dataTableSubject = new BehaviorSubject<any[]>(null);
    this.dataTable = this.dataTableSubject.asObservable();
    this.machineProductsSubject = new BehaviorSubject<any[]>([]);
    this.machineProducts = this.machineProductsSubject.asObservable();
    this.machineDetentionsSubject = new BehaviorSubject<any[]>([]);
    this.machineDetentions = this.machineDetentionsSubject.asObservable();
    this.machineInEditIdSubject = new BehaviorSubject<any[]>([]);
    this.machineInEditId = this.machineInEditIdSubject.asObservable();
  }

  async refreshDataTable() {
    this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}`).subscribe((ok: any) => {
      this.dataTableSubject.next(ok)
    })
  }



  dataManagerChangeValue(value) {
    this.dataManagerSubject.next(value)
  }

  machineProductsChangeValue(value) {
    this.machineProductsSubject.next(value)
  }

  machineDetentionsChangeValue(value) {
    this.machineDetentionsSubject.next(value)
  }

  public get machineProductsList() {
    return this.machineProductsSubject.value
  }
  public get machineDetentionsList() {
    return this.machineDetentionsSubject.value
  }
  public get machineInEditIdValue() {
    return this.machineInEditIdSubject.value
  }

  async refreshProductsOfMachine(id) {
    this.machineInEditIdSubject.next(id)
    this.getAllProductsByMachine(id).subscribe((ok: any) => {
      this.machineProductsSubject.next(ok)
    })
  }

  async refreshDetentionsOfMachine(id) {
    this.machineInEditIdSubject.next(id)
    this.getAllDetentionsByMachine(id).subscribe((ok: any) => {
      this.machineDetentionsSubject.next(ok)
    })
  }


  getAll() {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}`);
  }

  getAllActives() {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}s/active`);
  }
  getAllGood() {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}s/good`);
  }


  getAllInDetention() {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}s/in/detention`);
  }


  getAllInMaintenance() {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}s/in/maintenance`);
  }

  getAllProductsByMachine(id) {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}/products/${id}`);
  }

  getAllDetentionsByMachine(id,idCat=null) {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}/detentions/${id}${idCat ? '?idCat='+idCat:''}`);
  }
  getAllDetentions() {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.entityPathName}/detentions`);
  }

  createProductsOfMachine(data, id) {
    return this.http.post<any[]>(`${environment.apiUrl}/${this.entityPathName}/products/${id}`, data,
      {
        headers: {
          "content-type": "application/json"
        }

      });
  }

  createDetentionsOfMachine(data, id) {
    return this.http.post<any[]>(`${environment.apiUrl}/${this.entityPathName}/detentions/${id}`, data,
      {
        headers: {
          "content-type": "application/json"
        }

      });
  }


  getById(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/${this.entityPathName}/id/${id}`);
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

  updateMachineProduct(data) {
    return this.http.put<any>(`${environment.apiUrl}/${this.entityPathName}/products/`, data, {
      headers: {
        "content-type": "application/json"
      }
    });
  }

  updateMachineDetention(data) {
    return this.http.put<any>(`${environment.apiUrl}/${this.entityPathName}/detentions/`, data, {
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

  deleteMachineProduct(data) {
    return this.http.delete<any>(`${environment.apiUrl}/${this.entityPathName}/products/${data.id}`, {
      headers: {
        "content-type": "application/json"
      }
    });
  }
  deleteMachineDetention(id) {
    return this.http.delete<any>(`${environment.apiUrl}/${this.entityPathName}/detentions/${id}`, {
      headers: {
        "content-type": "application/json"
      }
    });
  }
}
