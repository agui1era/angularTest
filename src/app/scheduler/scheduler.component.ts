import {Component, Input, OnInit} from '@angular/core';
import {TurnService} from "@app/_services/turn.service";
import {SensorService} from "@app/_services/sensor.service";
import * as moment from "moment";
import {MatDialog} from "@angular/material/dialog";
import {AddProductionManagerComponent} from "@app/add-production-manager/add-production-manager.component";
import {DetalleSchedulerComponent} from "@app/detalle-scheduler/detalle-scheduler.component";
import {DetalleSchedulerDataSensorComponent} from "@app/detalle-scheduler-data-sensor/detalle-scheduler-data-sensor.component";
import {DetalleSchedulerInfoProdComponent} from "@app/detalle-scheduler-info-prod/detalle-scheduler-info-prod.component";

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.sass']
})
export class SchedulerComponent implements OnInit {

  @Input("turn") turn: any = "";
  @Input("labelH") labelH = "";
  @Input("eventsList") eventsList: any = [];
  @Input("tope") tope: any
  @Input("prodInfo") prodInfo: any = ""
  @Input("sensorData") sensorData: any = ""
  aMinute = []
  wid: number = 1.557377049
  produccionEn0 = true
  dataSensorList = []
  activeTurnObj: any = {}
  minutot = 60
  spAsignado:any = {}
  constructor(
    private dialog: MatDialog,
    private turnService: TurnService,
    private sensorService: SensorService
  ) {
  }

  get getspAsignado(){
    return JSON.parse(localStorage.getItem("sp"))
  }

  ngOnInit(): void {
    console.log(this.prodInfo);

    console.log(this.eventsList);
    this.tope = parseInt(this.tope as string)
    this.sensorData == undefined ? this.sensorData = {} : ''
    this.activeTurnObj = JSON.parse(localStorage.getItem("activeTurn"))
    //this.spAsignado = JSON.parse(localStorage.getItem("sp"))
    if (this.activeTurnObj.idmaquina_maquina.conSensor) {
      console.log(this.sensorData);
    } else {
     /* console.log(this.prodInfo);
      this.produccionEn0 = false*/
    }
    /*console.log(this.labelH);
    console.log(this.prodInfo);*/
    //console.log(this.turn);
    // this.turnService.getAllProductionsByTurn(this.turn).subscribe((okProductionTurn:any) => {
    //console.log(okProductionTurn.body);
    /* for(let pr of okProductionTurn.body){

       if(pr.hora.split(":")[0] == this.labelH.split(":")[0] && pr.cantidad > 0){
         this.produccionEn0 = false
         console.log("ASDASDASD");
       }
     }*/

    /* if (okProductionTurn.body.data.find(pr => pr.hora.split(":")[0] == this.labelH.split(":")[0] && pr.cantidad > 0)) {
       this.produccionEn0 = false

     }*/


    // this.sensorService.getProdByTurnAndHour(this.turn, this.labelH.split(":")[0]).subscribe(productionSensorOk => {

    /*   this.dataSensorList = productionSensorOk
       if (productionSensorOk
         .find(o => moment(o.timestamp).format("HH") == this.labelH.split(":")[0] &&
           o.produccion > 0
         )) {


         this.produccionEn0 = false
       }*/
    for (let i = 0; i < 60; i++) {
      let dataEvent: any = {
        n: i,
        w: this.wid + "vw"
      }
      let inSensor = this.dataSensorList.find(o => moment(o?.timestamp).format("mm") == i.toString() &&
        moment(o?.timestamp).format("HH") == this.labelH.split(":")[0]
      )

      if (inSensor && inSensor.produccion == 0) {
        dataEvent.PROD0 = true
      }


      if (i <= this.tope) {
        dataEvent.ok = true
      }
      if (i == this.tope) {
        dataEvent.elTope = true
      }

      let exst = this.eventsList.find(o => o.m == i)

      if (exst) {
        dataEvent[exst.type] = true
        //dataEvent.warning = exst.warning
        dataEvent.info = exst.info
        dataEvent.w = this.wid + "vw"

        if ((exst.f - i) > 1) {
          i = +exst.f - 1
          dataEvent.w = (+this.wid * (+exst.f - +exst.m)) + "vw"

        }

      }
      this.aMinute.push(dataEvent)
    }


    // })
    //  })
    //console.log(this.tope);
    //console.log(this.eventsList);


    //console.log(this.aMinute);
  }

  ocultar(min) {
    console.log(min)
    if (min.info) {
      const dialogRef = this.dialog.open(DetalleSchedulerComponent, {
        data: min,
        width: "45vw"
      })
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
    } else if (this.sensorData[min.n]) {
      const dialogRef = this.dialog.open(DetalleSchedulerDataSensorComponent, {
        data: this.sensorData[min.n],
      })
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
    }

    /* console.log(min.hover);
     min.hover = !min.hover*/
  }

  obtenerEstado(min) {
    let estado = 'sched-Ok'
    return estado
  }

  verInterruption(d) {
    const dialogRef = this.dialog.open(DetalleSchedulerComponent, {
      data: d,
      width: "32vw"

    })
    dialogRef.afterClosed().subscribe(result => {
      d.mostrar = result
      console.log(result);
    });
  }

  mostrarProduccion(sd,pi=null,i=null) {
    console.log(sd);
    console.log(pi);
    console.log(i);
    console.log(this.labelH);


    if (this.activeTurnObj.idmaquina_maquina.conSensor) {
      const dialogRef = this.dialog.open(DetalleSchedulerDataSensorComponent, {
        data: sd,
        width: "32vw"

      })
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
    }else{
      const dialogRef = this.dialog.open(DetalleSchedulerInfoProdComponent, {
        data: {
          listaProds:pi,
          infoMin:{
            min:i,
            hora:this.labelH
          }
        },
        width: "32vw",
        height:"80vh"

      })
    }

  }

}
