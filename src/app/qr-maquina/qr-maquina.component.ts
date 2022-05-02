import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {SettingsService} from "@app/_services/settings.service";

@Component({
  selector: 'app-qr-maquina',
  templateUrl: './qr-maquina.component.html',
  styleUrls: ['./qr-maquina.component.sass']
})
export class QrMaquinaComponent implements OnInit {
  fotoEmpresa: any = ""
  dataQR:any = {}

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private settingsService: SettingsService

  ) { }


  async ngOnInit(): Promise<void> {
    let settingsObj:any = await this.settingsService.getSettings().toPromise()
    this.fotoEmpresa = settingsObj.foto
    this.dataQR = {...this.data.maq}
  }

}
