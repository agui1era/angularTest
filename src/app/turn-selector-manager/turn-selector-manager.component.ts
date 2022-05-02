import {Component, OnInit} from '@angular/core';
import {TurnService} from "@app/_services/turn.service";
import {MachineService} from "@app/_services/machine.service";
import {Alerts} from "@app/_helpers/alerts";
import {AuthenticationService} from "@app/_services";
import {Role, User} from "@app/_models";
import * as moment from 'moment';

@Component({
  selector: 'app-turn-selector-manager',
  templateUrl: './turn-selector-manager.component.html',
  styleUrls: ['./turn-selector-manager.component.sass']
})
export class TurnSelectorManagerComponent implements OnInit {
  machineSelected = ""
  machines = []
  turnosDeMaquina = []
  posTurno = 0
  longTurnos = 0
  selectedTurno: any = {}
  machineInitial = ""
  user: User;
  turnosTerminados = true
  sensoresMaquina = []
  operadoresMaquina = []


  constructor(
    private turnService: TurnService,
    private machineService: MachineService,
    private alerts: Alerts,
    private authenticationService: AuthenticationService
  ) {
  }

  get esteTurno() {
    return JSON.parse(localStorage.getItem("activeTurn"))
  }

  ngOnInit(): void {

    this.authenticationService.user.subscribe(x => this.user = x);
    //console.log(this.turnService.activeTurnObjManagerValue);
    if (this.turnService.activeTurnObjManagerValue.horafin != null) {
      this.turnosTerminados = true
    }


    this.machineSelected = this.turnService.activeTurnObjManagerValue.idmaquina_maquina.id
    if (this.turnosTerminados) {
      this.machineService.getAllGood().subscribe(okM => {

        this.machines = okM

      })
    } else {

      this.machineService.getAllActives().subscribe(okM => {
        this.machines = okM

      })
    }

    this.turnService.getTurnOfTodayByMachine(this.machineSelected).subscribe(okTurnosMaquina => {
      this.turnosDeMaquina = okTurnosMaquina
      this.posTurno = okTurnosMaquina.findIndex(o => o.id == this.turnService.activeTurnObjManagerValue.id)

      this.turnService.getOperatorsByTurn(this.turnosDeMaquina[this.posTurno].id).subscribe(ok => {
        this.machineService.getById(this.turnosDeMaquina[this.posTurno].idmaquina).subscribe(okMachineServi => {
          this.operadoresMaquina = ok
          this.sensoresMaquina = okMachineServi.sensors
        })
      })

      /*console.log(this.turnosDeMaquina);
      this.seleTurno(okTurnosMaquina)*/
    })


    /* this.cargarMaquinas()
     console.log(this.turnService.activeTurnObjManagerValue);
     this.authenticationService.user.subscribe(x => this.user = x);
 */
    //this.machineSelected = this.turnService.activeTurnObjManagerValue.idmaquina_maquina.id
    /* this.turnService.getTurnOfTodayByMachine(this.machineSelected).subscribe(okTurnosMaquina => {
       this.turnosDeMaquina = okTurnosMaquina
       console.log(this.turnosDeMaquina);
       this.seleTurno(okTurnosMaquina)
     })*/

  }

  cargarMaquinas() {
    if (this.turnosTerminados) {
      this.machineService.getAllGood().subscribe(okM => {
        this.machines = okM

        if (okM.find(o => o.id == this.turnService.activeTurnObjManagerValue.idmaquina_maquina.id)) {
          console.log("OO");

          this.machineSelected = this.turnService.activeTurnObjManagerValue.idmaquina_maquina.id
        } else {
          console.log("XX");

          this.machineSelected = okM[0].id
        }
        console.log(this.machineSelected);

        this.cambiarMaquina()


        /*   if (this.turnosDeMaquina.findIndex(o => o.id == this.turnService.activeTurnObjManagerValue.id) == -1) {
             this.machineSelected = okM[0].id
           }else{
             this.machineSelected = this.turnService.activeTurnObjManagerValue.idmaquina_maquina.id
           }
           */
        /*if(this.machines.length>=1){
          this.machineSelected = t cambiarFechaTurnosElegidos(){
    console.log("cambiar fecha")
  }his.machines[0].id
        }*/


      })
    } else {
      this.machineService.getAllActives().subscribe(okM => {
        this.machines = okM

        if (okM.find(o => o.id == this.turnService.activeTurnObjManagerValue.idmaquina_maquina.id)) {
          this.machineSelected = this.turnService.activeTurnObjManagerValue.idmaquina_maquina.id
        } else {
          this.machineSelected = okM[0].id
        }
        this.cambiarMaquina()

      })
    }
  }

  cambiarFechaTurnosElegidos(event) {
    console.log(event.value);
    console.log("cambiar fecha")
    let fechaInputElegida = moment(event.value)
    let turnoEncontrado = this.turnosDeMaquina.slice().sort((a, b) => {
        console.log(b.id);
        console.log(
          moment(a.horainicio).toDate().getTime() - fechaInputElegida.toDate().getTime()
        )
        return moment(a.horainicio).toDate().getTime() - fechaInputElegida.toDate().getTime()

      }
    ).reverse()


    console.log(this.turnosDeMaquina);
    this.turnService.activeTurnObjManagerChangeValue(turnoEncontrado[0])
    localStorage.removeItem("activeTurn")
    localStorage.setItem("activeTurn", JSON.stringify(turnoEncontrado[0]))
    this.posTurno = this.turnosDeMaquina.findIndex(o => o.id == turnoEncontrado[0].id)


  }

  get isAdmin() {
    return this.user && this.user.role === Role.admin;
  }

  get isOperator() {
    return this.user && this.user.role === Role.operador;
  }

  get isSupervisor() {
    return this.user && this.user.role === Role.supervisor;
  }

  cambiarMaquina() {

    this.turnService.getTurnOfTodayByMachine(this.machineSelected).subscribe(okTurnosMaquina => {
      /* if(okTurnosMaquina.length == 0 || okTurnosMaquina.find(o=>o.horafin)){*/
      /*if (!okTurnosMaquina.find(o => o.horafin == null)) {
        this.alerts.generic('No existen turnos activos', '¿Deseas iniciar un turno en esta maquina?')
          .then(modal => {
            if (modal.isConfirmed) {
              this.machineInitial = this.machineSelected
            } else {
              this.machineSelected = this.machineInitial
            }
          })
      } else {
        this.turnosDeMaquina = okTurnosMaquina
        this.seleTurno(okTurnosMaquina)
      }*/

      if (this.turnosTerminados) {
        this.turnosDeMaquina = okTurnosMaquina

      } else {
        this.turnosDeMaquina = okTurnosMaquina.filter(o => o.horafin == null)
      }

      console.log(this.turnosDeMaquina);
      console.log(this.turnosDeMaquina.length);
      console.log("this.turnosDeMaquina");
      if (okTurnosMaquina.length >= 1) {
        this.posTurno = 0
      }
      if (this.turnosDeMaquina.find(o => o.id == this.turnService.activeTurnObjManagerValue.id)) {
        this.posTurno = this.turnosDeMaquina.findIndex(o => o.id == this.turnService.activeTurnObjManagerValue.id)
      }
      console.log(this.posTurno);
      console.log(this.turnosDeMaquina[this.posTurno]);

      this.turnService.getOperatorsByTurn(this.turnosDeMaquina[this.posTurno].id).subscribe(ok => {
        this.machineService.getById(this.turnosDeMaquina[this.posTurno].idmaquina).subscribe(okMachineServi => {
          console.log(okMachineServi);
          this.operadoresMaquina = ok
          this.sensoresMaquina = okMachineServi.sensors
          this.setiarTurno()

        })
      })
      /*  this.seleTurno(okTurnosMaquina)
        console.log(this.turnosDeMaquina);*/
    })
  }

  setiarTurno() {
    this.turnService.activeTurnObjManagerChangeValue(this.turnosDeMaquina[this.posTurno])
    localStorage.removeItem("activeTurn")
    localStorage.setItem("activeTurn", JSON.stringify(this.turnosDeMaquina[this.posTurno]))

  }

  seleTurno(turnos) {
    if (turnos.length >= 1) {
      this.selectedTurno = turnos[0]
      console.log(this.turnService.activeTurnObjManagerValue)
      console.log(this.turnosDeMaquina.findIndex(o => o.id == this.turnService.activeTurnObjManagerValue.id));
      console.log(this.turnosDeMaquina)
      this.posTurno = this.turnosDeMaquina.findIndex(o => o.id == this.turnService.activeTurnObjManagerValue.id)
      if (this.posTurno == -1) {
        this.posTurno = 0
      }
      this.longTurnos = turnos.length
      this.turnService.activeTurnObjManagerChangeValue(this.turnosDeMaquina[this.posTurno])
      localStorage.removeItem("activeTurn")
      localStorage.setItem("activeTurn", JSON.stringify(this.turnosDeMaquina[this.posTurno]))

    }
  }

  cambiarTurno(direcc) {

    switch (direcc) {
      case 'atras':
        if (this.posTurno == 0) {
          this.posTurno = this.turnosDeMaquina.length - 1
        } else {
          this.posTurno -= 1
        }

        break;
      case 'adelante':
        if (this.posTurno == this.turnosDeMaquina.length - 1) {
          this.posTurno = 0
        } else {
          this.posTurno += 1
        }

        break;
    }
    // console.log(this.posTurno);

    //console.log(this.turnosDeMaquina[this.posTurno]);
    this.turnService.activeTurnObjManagerChangeValue(this.turnosDeMaquina[this.posTurno])
    localStorage.removeItem("activeTurn")
    localStorage.setItem("activeTurn", JSON.stringify(this.turnosDeMaquina[this.posTurno]))

  }

  cambioTurnos() {
    this.cargarMaquinas()
  }

}
