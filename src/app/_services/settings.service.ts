import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '@environments/environment';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class SettingsService {
  private dataManagerSubject: BehaviorSubject<any>;
  public dataManager: Observable<any>;

  constructor(private http: HttpClient) {
    this.dataManagerSubject = new BehaviorSubject<any>(null);
    this.dataManager = this.dataManagerSubject.asObservable();
  }

  getAll() {
    return this.http.get<any[]>(`${environment.apiUrl}/hand-hour`);
  }

  assignDay(data) {
    return this.http.post<any[]>(`${environment.apiUrl}/hand-hour/assign`,data);
  }

  getTime() {
    return this.http.get<any[]>(`${environment.apiUrl}/the-time`);
  }

  getDays() {
    return this.http.get<any[]>(`${environment.apiUrl}/dias`);
  }

  updateDay(data) {
    return this.http.post<any[]>(`${environment.apiUrl}/dias`,data);
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

}
