import {Component, OnInit} from '@angular/core';
import {SettingsService} from '@app/_services/settings.service';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-horarios-manager',
  templateUrl: './horarios-manager.component.html',
  styleUrls: ['./horarios-manager.component.sass']
})
export class HorariosManagerComponent implements OnInit {
  allDaysPermitidos = []
  handHour: any = {}
  diasDelHorario = []


  constructor(
    private settingsService: SettingsService,
    private dialogRef2: MatDialogRef<HorariosManagerComponent>,
  ) {
  }

  ngOnInit(): void {
    this.handHour.diashorarioss = []
    this.settingsService.getDays().subscribe(okD => {
      this.allDaysPermitidos = okD
    })
  }

  buscarDia(dia, horario) {
    return horario.diashorarioss.find(o => o.iddiaspermitidos == dia.id)
  }

  async crear() {
    console.log(this.diasDelHorario)
    console.log(this.handHour)
    let okH: any = await this.settingsService.create(this.handHour).toPromise()
    console.log(okH);
    for (let d of this.diasDelHorario) {
      let req = {
        idhorarios: okH.id,
        iddiaspermitidos: d.id,
      }
      await this.settingsService.assignDay(req).toPromise()
    }
    this.dialogRef2.close(true)

  }

  agregarDia(dia, event) {
    if (event.checked) {
      this.diasDelHorario.push(dia)
    } else {
      this.diasDelHorario = this.diasDelHorario.filter(o => o.nombre != dia.nombre)
    }
  }
}
