import {Component, OnInit} from '@angular/core';
import {MachineService} from "@app/_services/machine.service";
import {TurnService} from "@app/_services/turn.service";
import * as moment from 'moment';
import {MatDialog} from "@angular/material/dialog";
import {ProductTurnManagerComponent} from "@app/product-turn-manager/product-turn-manager.component";
import {AddProductionManagerComponent} from "@app/add-production-manager/add-production-manager.component";
import {SettingsService} from "@app/_services/settings.service";
import * as io from "socket.io-client";
import {environment} from "@environments/environment";
import {SensorService} from "@app/_services/sensor.service";
import {Router} from "@angular/router";
import {Role, User} from "@app/_models";
import {AuthenticationService} from "@app/_services";

@Component({
  selector: 'app-production-input',
  templateUrl: './production-input.component.html',
  styleUrls: ['./production-input.component.sass']
})
export class ProductionInputComponent implements OnInit {
  selectedMachineId = ""
  isActiveTurnObj: any = {};
  isActiveTurn: any = false;
  productTurnList = []
  allProductionList = []
  horariosManiana = ["07:00 a 08:00", "08:00 a 09:00", "09:00 a 10:00", "10:00 a 11:00", "11:00 a 12:00", "12:00 a 13:00", "13:00 a 14:00"]
  horariosTarde = ["14:00 a 15:00", "15:00 a 16:00", "16:00 a 17:00", "17:00 a 18:00", "18:00 a 19:00", "19:00 a 20:00", "20:00 a 21:00", "21:00 a 22:00"]
  horariosNoche = ["22:00 a 23:00", "23:00 a 00:00", "00:00 a 01:00", "01:00 a 02:00", "02:00 a 03:00", "03:00 a 04:00", "04:00 a 05:00", "05:00 a 06:00", "06:00 a 07:00"]
  horasPermitidas = []
  horasReconocidas = []
  displayedColumns: string[] = ['Hora', 'Producto', 'Cantidad', 'Formato', 'Condicion', 'Serie'];
  displayedColumnsSensor: string[] = ['Hora', 'Cantidad'];
  dataSensor = []
  private socket: any;
  now = 0
  sensorActive = false
  loading = false
  allProductsTurn = []
  productoTurnoActivo: any = {}
  vistaProd = false
  user: User;

  constructor(
    private service2: MachineService,
    private service: TurnService,
    private dialog: MatDialog,
    private settingsService: SettingsService,
    private sensorService: SensorService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {

    this.socket = io.io(environment.apiUrl);


  }

  get isOperator() {
    return this.user && this.user.role === Role.operador;
  }

  ngOnInit(): void {
    this.authenticationService.user.subscribe(x => this.user = x);

    this.loading = true
    this.sensorActive = false

    if (JSON.parse(localStorage.getItem("activeTurn")) == null) {
      this.router.navigateByUrl("/").then(oknav => {

      })
    }
    /*this.service.refreshActiveTurn().then(ok=>{

    })*/
    this.isActiveTurnObj = {
      idturno_turno: JSON.parse(localStorage.getItem("activeTurn")),
      idturno: JSON.parse(localStorage.getItem("activeTurn")).id
    }
    // this.isActiveTurnObj = {idturno_turno:this.service.activeTurnObjManagerValue,idturno:this.service.activeTurnObjManagerValue.id}


    this.sensorService.getProdByTurn(this.isActiveTurnObj.idturno_turno.id).subscribe(okSensorData => {
      console.log(okSensorData);
      if (okSensorData.length >= 1) {
        this.sensorActive = true
        this.dataSensor = okSensorData
        console.log(this.dataSensor);
        console.log("this.dataSensor");
      }
    })
    console.log(this.isActiveTurnObj);
    /* this.service.dataHorarioManagerChangeValue(this.isActiveTurnObj.idturno_turno.horario)
 */
    this.service.getProductTurnByTurn(this.isActiveTurnObj.idturno).subscribe(allProductTurnsOfTurn => {
      this.allProductsTurn = allProductTurnsOfTurn
      console.log(this.allProductsTurn);
      this.productoTurnoActivo = JSON.parse(localStorage.getItem("activeOTpt"))
      /*
    this.productoTurnoActivo = this.allProductsTurn.find(o => o.activoenturno)
    if(JSON.parse(localStorage.getItem("activeOTpt")).idordendetrabajo){
      this.productoTurnoActivo = this.allProductsTurn.find(o => o.idordendetrabajo == JSON.parse(localStorage.getItem("activeOTpt")).idordendetrabajo)
    }*/
      console.log("this.productoTurnoActivo");
      console.log(this.productoTurnoActivo);
      this.getAllProduction(this.isActiveTurnObj.idturno)
    })

    /* this.refreshPendingTurn()
 */
    /* this.socket.on('hora', data => {
       this.getAllProduction(this.isActiveTurnObj.idturno)
     })*/
  }


  refreshPendingTurn(notEnd?) {
    this.service.getPendings().subscribe((pendingsTurn: any) => {
      /*  this.service.getTurnOfTodayByMachine(this.selectedMachineId).subscribe(machineTurns => {*/
      /*  console.log(machineTurns);
        for (let pTurn of pendingsTurn) {
          if (machineTurns.find(o => o.id == pTurn.idturno)) {
            this.isActiveTurnObj = pTurn;
            this.isActiveTurn = true;
            this.service.dataHorarioManagerChangeValue(pTurn.idturno_turno.horario)
          }
        }*/

      /*  this.isActiveTurnObj = pendingsTurn[0]
        this.service.dataHorarioManagerChangeValue(this.isActiveTurnObj.idturno_turno.horario)


        console.log(pendingsTurn);
        this.service.getProductTurnByTurn(this.service.activeTurnsValue[0].idturno).subscribe(allProductTurnsOfTurn => {
          this.allProductsTurn = allProductTurnsOfTurn
          this.productoTurnoActivo = this.allProductsTurn.find(o => o.activoenturno)

        })
        this.getAllProduction(this.isActiveTurnObj.idturno)

  */
    })
    /*})*/

  }

  getAllProduction(id) {

    this.service.getAllProductionsByTurn(id).subscribe((allProductionList: any) => {

      this.allProductionList = allProductionList.body.data
      this.allProductionList = this.allProductionList.filter(o => o.idprodturn_productoturno.idordendetrabajo == this.productoTurnoActivo.idordendetrabajo)
      console.log(this.allProductionList);
      console.log(allProductionList.headers.get("lahora"));
      /* let fechaLimite = new Date(allProductionList.headers.get("lahora"))
 */
      let horaSv = allProductionList.headers.get("lahora")
      console.log(parseInt(horaSv.toString()));
      //let fecha = new Date(parseInt(horaSv.toString()))
      let fecha = this.isActiveTurnObj.idturno_turno.horafin == null ? new Date(parseInt(horaSv.toString())) : new Date(this.isActiveTurnObj.idturno_turno.horafin)

      this.now = fecha.getTime()


      /*
       let fecha = moment(allProductionList.headers.get("lahora") as unknown as number *10).format("hh:mm:ss")
      */
      console.log(allProductionList.body);

      console.log(fecha);
      console.log(this.isActiveTurnObj);

      let fechaInicio = new Date(this.isActiveTurnObj.horainicio)

      let fechaAux = new Date()

      function subirHora(fechaI, alm) {
        if (fechaI.getTime() > fecha.getTime()) {
          return false
        } else {
          let horaSumada = moment(fechaI)
          alm.push(horaSumada.format("HH:mm"))
          horaSumada.add(1, 'hours')
          subirHora(horaSumada.toDate(), alm)
        }
      }


      let horasReales: any = []
      horasReales = this.horas()

      let horaTurno = new Date(this.isActiveTurnObj.idturno_turno.horainicio).getHours()

      this.settingsService.getAll().subscribe(horasHorarios => {
        console.log(horasReales);

        let bloqueCorrespondiente = horasHorarios.find(horahorar => horahorar.horainicio.substring(0, 2) == horaTurno)

        let listHoursFull = []

        let fechaInitial = new Date(this.isActiveTurnObj.idturno_turno.horainicio)
        console.log(fechaInitial);
        subirHora(fechaInitial, listHoursFull)
        console.log(listHoursFull);


        this.horasPermitidas = listHoursFull.map(o => {
          console.log(o);
          return {text: o}
        })
        if (this.isActiveTurnObj.idturno_turno.horafin != null) {
          this.horasPermitidas.pop()
        }

        for (let recordProduction of this.allProductionList) {
          console.log(recordProduction);

          for (let ifor = 0; ifor < this.horasPermitidas.length; ifor++) {
            if (this.horasPermitidas[ifor].text.substring(0, 5) == recordProduction.hora) {
              this.horasPermitidas[ifor].cantidad = recordProduction.cantidad
              this.horasPermitidas[ifor].idprodturn_productoturno = recordProduction.idprodturn_productoturno
            }


          }
        }
        this.loading = false


      })


    })

  }

  openAddProd(data) {
    this.loading = true
    data.prodTurn = {}
    data.prodTurn.id = this.productoTurnoActivo.id

    const dialogRef = this.dialog.open(AddProductionManagerComponent, {
      width: "400px",
      data
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      this.getAllProduction(this.isActiveTurnObj.idturno)
    });


  }

  abrirVistaProd() {
    this.service.dataActiveTurnsManagerChangeValue([{
      idturno_turno: {...JSON.parse(localStorage.getItem("activeTurn"))},
      idturno: JSON.parse(localStorage.getItem("activeTurn")).id
    }])
    this.service.activeTurnObjManagerChangeValue({
      idturno_turno: {...JSON.parse(localStorage.getItem("activeTurn"))},
      idturno: JSON.parse(localStorage.getItem("activeTurn")).id
    })
    this.vistaProd = true
  }

  openAddProductTurn(data) {
    console.log(this.productoTurnoActivo);
    console.log(data);
    const dialogRef = this.dialog.open(ProductTurnManagerComponent, {
      data: {
        ...data,
        horasPermitidas: this.horasPermitidas,
        fecha: this.now
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.getProductTurn()
      this.getAllProduction(this.isActiveTurnObj.idturno)

    });
  }

  getProductTurn() {

    /*  this.service.getProductTurnByTurn(this.isActiveTurnObj.idturno).subscribe(productTurnsList => {
        console.log(productTurnsList);

        /!*for (let production of productTurnsList) {
          this.getProductionByProductTurn(production.id)
        }*!/
      })*/

  }


  getProductionByProductTurn(id) {
    this.service.getProductionByProductTurn(id).subscribe(productionOfProductTurn => {


      console.log(productionOfProductTurn);
      console.log(this.productTurnList.find(o => o.id == id));
      for (let i = 0; i < this.productTurnList.length; i++) {
        if (this.productTurnList[i].id == id) {
          console.log("si");
          console.log(i);
          let hours = {}

          console.log(hours);

        }
      }

    })
  }

  horas() {
    let horario = this.service.horarioValue
    //console.log(horario);
    return horario == 'mañana' ?
      this.horariosManiana : horario == 'tarde' ?
        this.horariosTarde : horario == 'noche' ? this.horariosNoche : ''
  }


}
