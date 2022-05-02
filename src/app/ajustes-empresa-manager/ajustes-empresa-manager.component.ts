import {Component, OnInit} from '@angular/core';
import {SettingsService} from "@app/_services/settings.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AppComponent} from "@app/app.component";
import {HorariosManagerComponent} from "@app/horarios-manager/horarios-manager.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-ajustes-empresa-manager',
  templateUrl: './ajustes-empresa-manager.component.html',
  styleUrls: ['./ajustes-empresa-manager.component.sass']
})
export class AjustesEmpresaManagerComponent implements OnInit {


  allDaysPermitidos = []

  allHandHour = []
  inputFoto: any = ""
  currentHandHour = []

  dataEmpresa: any = {}
  formDatosEmpresa: any = {}
  formHorarios: any = {}


  constructor(
    private settingsService: SettingsService,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {


    this.formDatosEmpresa = new FormGroup({
      nombreempresa: new FormControl(""),
      pais: new FormControl(""),
      thingsboardurl: new FormControl(""),
    })
    this.formHorarios = this._fb.group({
      nombre: new FormControl(""),
      horainicio: new FormControl(""),
      horafin: new FormControl(""),
    })
    this.loadHandHour().then(okhh => {
      console.log(okhh);
      this.settingsService.getDays().subscribe(okD => {
        this.allDaysPermitidos = okD
      })
    })
    this.settingsService.getSettings().subscribe((okSettings: any) => {
      console.log(okSettings);
      this.dataEmpresa = okSettings
      this.inputFoto = okSettings.foto
      this.formDatosEmpresa.controls.nombreempresa.setValue(okSettings.nombreempresa)
      this.formDatosEmpresa.controls.pais.setValue(okSettings.pais)
      this.formDatosEmpresa.controls.thingsboardurl.setValue(okSettings.thingsboardurl)
    })


  }

  buscarDia(dia, horario) {
    return horario.diashorarioss.find(o => o.iddiaspermitidos == dia.id)
  }

  loadHandHour() {
    return new Promise((o, n) => {
      this.settingsService.getAll().subscribe(ok => {
        console.log(ok);
        this.currentHandHour = ok
        o(ok)
      }, error => {
        n(error)
      })
    })
  }


  openSnackBar(message: string) {
    this._snackBar.open(message, 'cerrar', {duration: 1700});
  }

  editHandHour(obj) {
    this.settingsService.update(obj).subscribe(ok => {
      console.log(ok);
      this.loadHandHour()
      this.openSnackBar("Cambios guardados exitosamente!")

    })
  }

  handleUpload(event) {
    const file = event.target.files[0]
    if (file.size > 3072000) {
      alert("too big")
    }
    console.log(file.size);
    console.log(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.inputFoto = reader.result.toString()/*.split("base64,")[1]*/
      console.log(this.inputFoto);
      let req: any = {id: this.dataEmpresa.id}
      req.foto = this.inputFoto

      this.settingsService.updateSettings(req).subscribe(ok => {
      })
    };
  }

  editHandHourItem(key, obj) {
    let req = {id: obj.id}
    req[key] = obj[key]
    this.settingsService.update(req).subscribe(ok => {
      console.log(ok);
      this.loadHandHour()
    })
  }


  createHandHourItem() {
    this.dialog.open(HorariosManagerComponent).afterClosed().subscribe(ok => {
      this.loadHandHour()
    })
    /*this.settingsService.create({}).subscribe(ok => {
      console.log(ok);
      this.loadHandHour()
    })*/
  }

  updateSettings(key) {
    let req = {id: this.dataEmpresa.id}
    req[key] = this.formDatosEmpresa.controls[key].value
    this.settingsService.updateSettings(req).subscribe(ok => {
      console.log(ok);
      if (key == 'thingsboardurl') {
        AppComponent.thingsURL = this.formDatosEmpresa.controls[key].value
      }
      this.openSnackBar("Cambios guardados exitosamente!")
    })

  }

  cambiarDia(dia) {
    this.settingsService.updateDay({nombre: dia.nombre, permitido: dia.permitido}).subscribe(okUD => {
      console.log(okUD);
      this.openSnackBar("Cambios guardados exitosamente!")
    })
  }

  asociarDia(dia, horario) {
    let req = {
      idhorarios: horario.id,
      iddiaspermitidos: dia.id,

    }
    this.settingsService.assignDay(req).subscribe(ok => {
      console.log(ok);
      this.openSnackBar("Cambios guardados exitosamente!")
    })

  }

  deleteHandHour(id) {
    this.settingsService.delete(id).subscribe(ok => {
      console.log(ok);
      this.loadHandHour()
    })
  }


}
