import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {InterruptionService} from '@app/_services/interruption.service';
import * as moment from "moment";

@Component({
  selector: 'app-info-event-ts',
  templateUrl: './info-event-ts.component.html',
  styleUrls: ['./info-event-ts.component.sass']
})
export class InfoEventTsComponent implements OnInit {

  iYear = 0
  fYear = 0
  iMes = 0
  fMes = 0
  iDia = 0
  fDia = 0
  iHora = 0
  fHora = 0
  iMinuto = 0
  duracionInicial:any = ""
  fMinuto = 0


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef2: MatDialogRef<InfoEventTsComponent>,
    private interruptionService: InterruptionService,
  ) {
  }

  ngOnInit(): void {
    this.duracionInicial = moment.duration(moment(this.data.item.end).diff(moment(this.data.item.start))).asMinutes()
    if(this.duracionInicial >= 60){
      this.duracionInicial = moment.duration(moment(this.data.item.end).diff(moment(this.data.item.start))).asHours()
      this.duracionInicial = this.duracionInicial.toFixed(1) + " horas"
    }else{
      this.duracionInicial = this.duracionInicial.toFixed(1) + " minutos"
    }
    this.iYear = this.data.item.start.format("YYYY")
    this.iMes = this.data.item.start.format("MM")
    this.iDia = this.data.item.start.format("DD")
    this.iHora = this.data.item.start.format("HH")
    this.iMinuto = this.data.item.start.format("mm")

    this.fYear = this.data.item.end.format("YYYY")
    this.fMes = this.data.item.end.format("MM")
    this.fDia = this.data.item.end.format("DD")
    this.fHora = this.data.item.end.format("HH")
    this.fMinuto = this.data.item.end.format("mm")
  }


  guardar() {

    if (this.data.item.classes == 'int') {
      console.log("Es int");
      let fechaIFormat = moment(`${this.iYear} ${this.iMes} ${this.iDia} ${this.iHora}:${this.iMinuto}`)
      console.log(fechaIFormat.format("YYYY MM DD HH:mm"));
      let fechaFFormat = moment(`${this.fYear} ${this.fMes} ${this.fDia} ${this.fHora}:${this.fMinuto}`)
      console.log(fechaFFormat.format("YYYY MM DD HH:mm"));
      let nuevaDuracion = moment.duration(fechaFFormat.diff(fechaIFormat)).asSeconds()
      console.log(nuevaDuracion);
      console.log(this.data.item.idObj);
      let req = {
        id: this.data.item.idObj,
        horainicio: fechaIFormat.toDate().getTime(),
        duracion: nuevaDuracion
      }
      console.log(req);
      this.interruptionService.update(req).subscribe(okEdited => {
        console.log(okEdited);
      })
    }
    this.dialogRef2.close()
  }


  validarMinutosI() {
    if (this.iMinuto > 59) {
      this.iMinuto = 59
    } else if (this.iMinuto < 0) {
      this.iMinuto = 0
    }
  }

  validarMinutosF() {
    if (this.fMinuto > 59) {
      this.fMinuto = 59
    } else if (this.fMinuto < 0) {
      this.fMinuto = 0
    }
  }

  validarHorasF() {
    if (this.fHora > 23) {
      this.fHora = 23
    } else if (this.fHora < 0) {
      this.fHora = 0
    }
  }

  validarHorasI() {
    if (this.iHora > 23) {
      this.iHora = 23
    } else if (this.iHora < 0) {
      this.iHora = 0
    }
  }

  validarDiasI() {
    if (this.iDia > 31) {
      this.iDia = 31
    } else if (this.iDia < 0) {
      this.iDia = 0
    }
  }

  validarDiasF() {
    if (this.fDia > 31) {
      this.fDia = 31
    } else if (this.fDia < 0) {
      this.fDia = 0
    }
  }

  validarMesF() {
    if (this.fMes > 12) {
      this.fMes = 12
    } else if (this.fMes < 0) {
      this.fMes = 0
    }
  }

  validarMesI() {
    if (this.iMes > 12) {
      this.iMes = 12
    } else if (this.iMes < 0) {
      this.iMes = 0
    }
  }


}
