import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {SettingsService} from '@app/_services/settings.service';

@Component({
  selector: 'app-qr-user',
  templateUrl: './qr-user.component.html',
  styleUrls: ['./qr-user.component.sass']
})
export class QrUserComponent implements OnInit {
  fotoUsr = ""
  fotoEmpresa: any = ""
  dataQR:any = {}
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private settingsService: SettingsService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.fotoUsr = this.data.usr["foto"]
    let settingsObj:any = await this.settingsService.getSettings().toPromise()
    this.fotoEmpresa = settingsObj.foto
    this.dataQR = {...this.data.usr,foto:undefined}
  }

}
