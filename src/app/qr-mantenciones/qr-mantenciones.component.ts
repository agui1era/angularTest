import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {SettingsService} from "@app/_services/settings.service";

@Component({
  selector: 'app-qr-mantenciones',
  templateUrl: './qr-mantenciones.component.html',
  styleUrls: ['./qr-mantenciones.component.sass']
})
export class QrMantencionesComponent implements OnInit {
  fotoEmpresa: any = ""
  dataQR:any = {}
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private settingsService: SettingsService
  ) {
  }


  async ngOnInit(): Promise<void> {
    console.log(this.data);
    let settingsObj:any = await this.settingsService.getSettings().toPromise()
    this.fotoEmpresa = settingsObj.foto
    this.dataQR = {id:this.data.mant.id,horainicio:this.data.mant.fechaprogramada}
  }

}
