import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';

import {environment} from '@environments/environment';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {User} from "@app/_models";
import * as moment from "moment";
import {SettingsService} from "@app/_services/settings.service";

@Injectable({providedIn: 'root'})
export class UploadService {


  constructor(private http: HttpClient, private settingsService: SettingsService) {

  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('myFile', file);

    const req = new HttpRequest('POST', `${environment.apiUrl}/upload/detentions`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
  uploadSubproducts(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('myFile', file);

    const req = new HttpRequest('POST', `${environment.apiUrl}/upload/subproducts`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
  uploadOT(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('myFile', file);

    const req = new HttpRequest('POST', `${environment.apiUrl}/upload/ot`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
}
