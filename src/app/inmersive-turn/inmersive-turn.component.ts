import {Component, Inject, OnInit} from '@angular/core';
import {TurnService} from "@app/_services/turn.service";
import {DOCUMENT} from "@angular/common";
import Swal from "sweetalert2";
import {Observable, timer} from "rxjs";
import {map, shareReplay} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {AddProductionManagerComponent} from "@app/add-production-manager/add-production-manager.component";
import {AlertDetentionComponent} from "@app/alert-detention/alert-detention.component";
import {VelocidadManagerComponent} from "@app/velocidad-manager/velocidad-manager.component";
import {MermasManagerComponent} from "@app/mermas-manager/mermas-manager.component";
import {AuthenticationService} from "@app/_services";
import * as moment from "moment";
import * as io from "socket.io-client";
import {environment} from "@environments/environment";
import {InterruptionService} from "@app/_services/interruption.service";
import {SettingsService} from "@app/_services/settings.service";
import {Role, User} from "@app/_models";
import {ActivatedRoute, Route, Router} from "@angular/router";
import {SensorService} from "@app/_services/sensor.service";
import {AppComponent} from "@app/app.component";
import {SubproductService} from "@app/_services/subproduct.service";
import {SchedulerService} from "@app/_services/scheduler.service";
import {ProductTurnManagerComponent} from "@app/product-turn-manager/product-turn-manager.component";
import {BasicMenuComponent} from "@app/basic-menu/basic-menu.component";
import {AsociarOrdenTurnoPasadoComponent} from "@app/asociar-orden-turno-pasado/asociar-orden-turno-pasado.component";
import {OrdendetrabajoSumarProdComponent} from "@app/ordendetrabajo-sumar-prod/ordendetrabajo-sumar-prod.component";


@Component({
  selector: 'app-inmersive-turn',
  templateUrl: './inmersive-turn.component.html',
  styleUrls: ['./inmersive-turn.component.sass']
})
export class InmersiveTurnComponent implements OnInit {
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = '';
  velocidadIngresada = false
  showYAxisLabel = true;
  yAxisLabel = 'Piezas por hora';
  view: any[] = [700, 300];
  colorScheme = {
    domain: ['#00ffec', '#ffc716', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  single: any[];
  horasDeProduccion = 0
  cargandoScheduler = false
  elem;
  Teanimo = true
  isFullScreen = true
  isActiveTurnObj;
  suscriptionObject: any = {}
  turnoVacio: any = false
  subscriptionObject: any = {}
  standardProduction = 0
  spSelectedOfTurn: any = {}
  velocidadEsperadaMaq = 0
  productTurnList = []
  productTurnListNoDuplicados = []
  horariosManiana = ["07:00 a 08:00", "08:00 a 09:00", "09:00 a 10:00", "10:00 a 11:00", "11:00 a 12:00", "12:00 a 13:00", "13:00 a 14:00"]
  horariosTarde = ["14:00 a 15:00", "15:00 a 16:00", "16:00 a 17:00", "17:00 a 18:00", "18:00 a 19:00", "19:00 a 20:00", "20:00 a 21:00", "21:00 a 22:00"]
  horariosNoche = ["22:00 a 23:00", "23:00 a 00:00", "00:00 a 01:00", "01:00 a 02:00", "02:00 a 03:00", "03:00 a 04:00", "04:00 a 05:00", "05:00 a 06:00", "06:00 a 07:00"]
  private socket: any;
  loading = false
  produccionParadaEnCurso = false
  produccionParadaEnCursoObj: any = null
  timepoEnPausa = 0
  manualmanualSeriesList = []
  timepoEnPausaSecs = 0
  horaInicioInterrupcion0: any = ""
  intervaloPausa
  user: User;
  totalProdActual = 0
  totalProdTurnoActivo = 0
  totalPercent: any = ""
  horasProdObj: any = {}
  productoTurnoActivo: any = ""
  productoTurnoActivoTurnoNoTerminado: any = ""
  productoTurnoSumas: any = ""
  listScheduler = []
  schedulerDataObj: any = {}
  socketSeries: any = [{name: 'velocidad de la maquina', series: []}]
  manualSeries: any = [{name: 'velocidad de la maquina', series: []}]
  todaLaProd = []
  seriesList = []
  seriesListHora = []
  ptExiste = false
  mermasPtActivo = 0
  listaInterrupcionesPorEvento = []
  offsetDelTurno: any = 0
  sensorChartsEnMinutos = true

  constructor(
    private turnService: TurnService,
    @Inject(DOCUMENT) private document: any,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private interruptionService: InterruptionService,
    private settingsService: SettingsService,
    private router: Router,
    private sensorService: SensorService,
    private subProductService: SubproductService,
    private schedulerService: SchedulerService
  ) {

  }


  get SpSelected() {
    return localStorage.getItem("")
  }

  cambiarBarr(x) {
    return [
      {
        "name": "V. esperada",
        "value": this.velocidadEsperadaMaq
      },
      {
        "name": "V. actual",
        "value": x
      }
    ]
  }

  cb() {
    this.single = [
      {
        "name": "V. esperada",
        "value": this.velocidadEsperadaMaq || 0.1
      },
      {
        "name": "V. actual",
        "value": this.isActiveTurnObj.idturno_turno.velocidad || 0.1
      }
    ]
    console.log(this.single);
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

  get isSensor() {
    return localStorage.getItem('sensor') == 'ok'
  }

  ngOnInit(): void {
    localStorage.removeItem("sensor")
    this.ptExiste = !!JSON.parse(localStorage.getItem("pt"))

    this.authenticationService.user.subscribe(x => this.user = x);

    this.isActiveTurnObj = this.turnService.activeTurnsValue[0]
    console.log(this.isActiveTurnObj);
    this.turnService.activeTurnObjManagerChangeValue(this.isActiveTurnObj.idturno_turno)
    localStorage.setItem("activeTurn", JSON.stringify(this.isActiveTurnObj.idturno_turno))
    this.socket = io.io(environment.apiUrl)
    if (JSON.parse(localStorage.getItem("activeTurn")).horafin == null) {
      this.socket.emit("msg", {turno: this.isActiveTurnObj})
    }
    if (!this.ptExiste) {

      if (true) {
        const dialogRef = this.dialog.open(ProductTurnManagerComponent, {data: {cerrar: true}})
        dialogRef.afterClosed().subscribe(ptCerro => {
          this.getProductTurn()

        })
      }

    }
    this.socket.on("minuto", data => {
      if (this.isActiveTurnObj.idturno_turno.horafin == null) {

        this.loading = true
        console.log(data);
        this.turnService.recargarHorasPermitidas()
        this.getProductTurn()
      }


    })
    this.socket.on("sensores", dataSensor => {
      localStorage.setItem("sensor", 'ok')
      this.seriesList.push({name: moment(dataSensor.timestamp).format("HH:mm"), value: dataSensor.produccion})
      if (this.seriesList.length == 11) {
        this.seriesList.shift()
      }
      if (this.sensorChartsEnMinutos) {
        this.socketSeries = [
          {name: 'Productos por minuto', series: this.seriesList},
          {
            name: 'Esperado de la máquina', series: this.seriesList.map(o => {
              return {...o, value: this.offsetDelTurno / 60}
            })
          }
        ]
      } else {
        this.socketSeries = [
          {name: 'Productos por hora', series: this.seriesListHora},
          {
            name: 'Esperado de la máquina', series: this.seriesList.map(o => {
              return {...o, value: this.offsetDelTurno}
            })
          }

        ]
      }
    })
    this.elem = document.documentElement;


    this.suscriptionObject = this.turnService.activeTurnObjManager.subscribe(okTurno => {

      console.log(okTurno);
      if (okTurno) {
        this.otIndex = 0

        this.loading = true
        if (okTurno.idmaquina_maquina.conSensor) {
          this.seriesList = []
          this.sensorService.getProdByTurn(okTurno.id).subscribe(okDataSensorService => {
            console.log(okDataSensorService);
            /*     console.log(okDataSensorService.sort((a, b) => {
                   var keyA = new Date(a.timestamp),
                     keyB = new Date(b.timestamp);
                   // Compare the 2 dates
                   if (keyA < keyB) return -1;
                   if (keyA > keyB) return 1;
                   return 0;
                 }))*/
            let okDataSensorServiceList = okDataSensorService.filter(o => o.idordendetrabajo != null)
            for (let okdts of Array.from(new Set(okDataSensorServiceList))) {
              this.seriesList.push({name: moment(okdts.timestamp).format("HH:mm"), value: okdts.produccion})
              if (this.seriesList.length == 11) {
                this.seriesList.shift()
              }
            }

            this.socketSeries = [
              {name: 'Productos por minuto', series: this.seriesList}]
          })
        }

        //this.single = okTurno.velocidad == null ? this.cambiarBarr(0.000001) : this.cambiarBarr(+okTurno.velocidad)
        this.subProductService.getById(okTurno.idmaquina_maquina.subproductoasignado).subscribe(okSp => {
          this.standardProduction = okSp.stdprod || 0
          this.isActiveTurnObj = {idturno_turno: okTurno, idturno: okTurno.id}
          //    console.log(this.isActiveTurnObj);
          this.loading = true
          this.turnService.recargarHorasPermitidas()
          this.getProductTurn()
          setTimeout(() => {
            this.cambiarChart(false)
          }, 2000)
        })


      }

    })


    this.subscriptionObject = this.turnService.dataAllowedHoursManager.subscribe(ok => {

      if (ok) {
        this.otIndex = 0

        this.schedulerService.getByTurn(this.isActiveTurnObj.idturno_turno.id).subscribe(schedulerData => {
          console.log("schedulerData");
          console.log(schedulerData);
          this.schedulerDataObj = schedulerData
          for (let dObj of Object.keys(this.schedulerDataObj.horas)) {
            this.schedulerDataObj.horas[dObj].produccion = this.todaLaProd.filter(o => o.cantidad > 0).find(o => o.hora.split(":")[0] == dObj.split(":")[0])
          }
          console.log(this.schedulerDataObj);
          this.loading = false
          this.interruptionService.getByMachine(this.isActiveTurnObj.idturno_turno.idmaquina_maquina.id, this.isActiveTurnObj.idturno_turno.id)
            .subscribe(interruptionsResponse => {
              this.verificarInterrupcionInconclusaDelTurno(interruptionsResponse)
              this.getProductTurn()
            })
        });
      }
    })
    this.subProductService.getById(this.isActiveTurnObj.idturno_turno.idmaquina_maquina.subproductoasignado)
      .subscribe(okspAsigned =>   {

        this.standardProduction = okspAsigned.stdprod
        //this.velocidadEsperadaMaq = this.productoTurnoSumas.velesperada
        this.velocidadEsperadaMaq = okspAsigned.velprod


        this.single = [
          {
            "name": "V. esperada",
            "value": this.velocidadEsperadaMaq || 0.1
          },
          {
            "name": "V. actual",
            "value": this.isActiveTurnObj.idturno_turno.velocidad || 0
          }
        ];
      })
  }

  sumarProd() {
    this.dialog.open(OrdendetrabajoSumarProdComponent, {
      data: {
        pt: this.productoTurnoActivo,
        /*     listaDetProd:this.allProductionList,
             listaOT: this.allOrdenesDeTrabajo,
             idturno:this.initiatedTurn.id*/
      },
      height: "80vh",
      width: "70vw"
    }).afterClosed().subscribe(ok => {
      /*  this.recargarOT()*/
    })
  }

  abrirProductoTurno() {
    const dialogRef = this.dialog.open(ProductTurnManagerComponent, {data: undefined})

  }

  recargarParaMostrarParadas() {
    this.loading = true
    this.turnService.recargarHorasPermitidas()

  }

  async irAOrdenes() {
    this.loading = true
    let idTurno = JSON.parse(localStorage.getItem("pendingTurns"))[0].id
    let ok = await this.turnService.end(idTurno).toPromise()
    localStorage.removeItem("pendingTurns")
    localStorage.removeItem("activeTurn")
    localStorage.removeItem("activeOTpt")
    await this.turnService.refreshActiveTurns()
    console.log(ok)
    this.turnService.dataManagerChangeValue(false)
    this.closeFullscreen()
    location.reload()

    /* this.loading = true
     let idTurno = JSON.parse(localStorage.getItem("pendingTurns"))[0].id
     let ptActivo = this.productoTurnoActivo
     let idMaq = this.isActiveTurnObj.idturno_turno.idmaquina_maquina.id
     // this.closeFullscreen()
     // this.isActiveTurn = false;
     console.log(this.productoTurnoActivo);
     this.turnService.end(idTurno).subscribe(okk => {

       this.turnService.initOneOT({
         id: this.isActiveTurnObj.idturno_turno.idmaquina_maquina.id,
         idordendetrabajo: ptActivo.idordendetrabajo
       }).subscribe(ok => {
         localStorage.removeItem("pendingTurns")
         localStorage.removeItem("activeTurn")
         this.turnService.refreshActiveTurns()
         console.log(okk)
         this.turnService.dataManagerChangeValue(false)
         this.closeFullscreen()

         this.turnService.end(ok.id).subscribe(okkk => {
           this.router.navigateByUrl("/maquina/" + idMaq).then(oknav => {
             location.reload()

           })
         })

       })

     })*/

  }

  verificarInterrupcionInconclusaDelTurno(interrupciones) {
    let fechaInicioTurno = new Date(this.isActiveTurnObj.idturno_turno.horainicio)
    let encontradasDuracion0 = interrupciones.filter(o => new Date(o.horainicio).getTime() >= fechaInicioTurno.getTime() && o.duracion == 0)


    if (encontradasDuracion0.length >= 1) {
      this.settingsService.getTime().subscribe((timeSv: any) => {
        let fechaSV = moment(parseInt(timeSv.time))
        let fechaInterrupcion = moment(encontradasDuracion0[0].horainicio)
        this.horaInicioInterrupcion0 = fechaInterrupcion
        //console.log(fechaSV);
        //console.log(fechaInterrupcion);
        this.timepoEnPausa = parseInt(moment.duration(fechaSV.diff(fechaInterrupcion)).asMinutes().toFixed(2))
        clearInterval(this.intervaloPausa)
        this.intervaloPausa = setInterval(
          () => {
            fechaSV.add("1", "seconds")
            let tiempoEnPausaMins = moment.duration(fechaSV.diff(fechaInterrupcion)).asMinutes()
            this.timepoEnPausa = parseInt(tiempoEnPausaMins.toFixed(2))
            let tiempoEnPausaSecs = moment.duration(fechaSV.diff(fechaInterrupcion)).asSeconds()
            this.timepoEnPausaSecs = tiempoEnPausaSecs - (this.timepoEnPausa * 60)
          }, 1000
        )
        this.produccionParadaEnCurso = true
        this.produccionParadaEnCursoObj = encontradasDuracion0[0]


      })


    } else {
      this.produccionParadaEnCurso = false
      this.produccionParadaEnCursoObj = null
    }

  }

  cambiarChart(minutos) {
    if (minutos) {
      this.sensorChartsEnMinutos = true
    } else {
      this.sensorChartsEnMinutos = false
    }
    console.log(this.seriesListHora);
    if (this.sensorChartsEnMinutos) {
      this.socketSeries = [
        {name: 'Productos por minuto', series: this.seriesList},
        {
          name: 'Esperado de la máquina', series: this.seriesList.map(o => {
            return {...o, value: this.offsetDelTurno / 60}
          })
        }
      ]
    } else {
      console.log("EN HORA");
      this.turnService.getAllProductionsByTurn(this.isActiveTurnObj.idturno_turno.id).subscribe((okProduction: any) => {
        this.sensorService.getProdByTurn(this.isActiveTurnObj.idturno_turno.id).subscribe(okDataSensorService => {
          console.log(okDataSensorService);
          /*     console.log(okDataSensorService.sort((a, b) => {
                 var keyA = new Date(a.timestamp),
                   keyB = new Date(b.timestamp);
                 // Compare the 2 dates
                 if (keyA < keyB) return -1;
                 if (keyA > keyB) return 1;
                 return 0;
               }))*/
          let okDataSensorServiceList = okDataSensorService.filter(o => o.idordendetrabajo != null)
          for (let okdts of Array.from(new Set(okDataSensorServiceList))) {
            this.seriesList.push({name: moment(okdts.timestamp).format("HH:mm"), value: okdts.produccion})
            if (this.seriesList.length == 11) {
              this.seriesList.shift()
            }
          }
        })

        let horaIHorario = moment().hours(JSON.parse(localStorage.getItem('activeTurn')).idhorario_horario.horainicio.split(":")[0])
        let horaFHorario = moment().hours(JSON.parse(localStorage.getItem('activeTurn')).idhorario_horario.horafin.split(":")[0])
        console.log(JSON.parse(localStorage.getItem('activeTurn')).idhorario_horario.horainicio)

        let listaHorasReales = []
        while (horaIHorario.format("HH") != horaFHorario.format("HH")) {

          listaHorasReales.push(horaIHorario.format("HH"))
          horaIHorario.add(1, "h")
        }


        let listaOrdenadaProd = okProduction.body.data.sort((a, b) =>
          moment(a.dateH).toDate().getTime()
          -
          moment(b.dateH).toDate().getTime()
        )
        console.log(listaOrdenadaProd);
        let manualSeriesList = listaOrdenadaProd.map(o => {
          console.log(o);
          return {
            name: moment(o.dateH).format("HH:mm"),
            value: o.cantidad
          }
        })
        console.log(manualSeriesList);
        console.log(listaHorasReales);
        manualSeriesList = listaHorasReales.map(o => {
          console.log(o);
          console.log(manualSeriesList.find(oo => oo.name.split(":")[0] == o))
          return {
            name: o,
            value: manualSeriesList.find(oo => oo.name.split(":")[0] == o) ?
              manualSeriesList.find(oo => oo.name.split(":")[0] == o).value : 0
          }
        })
        console.log(this.seriesList);
        this.manualSeries = [
          {name: 'Productos por hora', series: manualSeriesList},
          {
            name: 'Esperado de la máquina', series: manualSeriesList.map(o => {
              return {...o, value: this.offsetDelTurno}
            })
          }
        ]

        console.log(manualSeriesList);

        console.log(this.manualSeries);
      })
      this.socketSeries = [
        {name: 'Productos por hora', series: this.seriesListHora},
        {
          name: 'Esperado de la máquina', series: this.seriesListHora.map(o => {
            return {...o, value: this.offsetDelTurno}
          })
        }

      ]

    }


  }

  obtenerInterrupcionesPorHora(hora, interruptions, indi, bloqueHoras) {
    /*  console.log(hora);
      console.log(interruptions);*/
    let interruptionsNow = interruptions.filter(o => {
      // console.log(indi);
      let inicioInt = new Date(o.horainicio).getTime()
      let desde = moment(this.isActiveTurnObj.idturno_turno.horainicio).add(indi, "h")
      let hasta = moment(this.isActiveTurnObj.idturno_turno.horainicio).add(indi + 1, "h")

      /* console.log(moment(inicioInt).format("dd/MM/YYYY HH:mm"));
       console.log(desde.format("dd/MM/YYYY HH:mm"));
       console.log(hasta.format("dd/MM/YYYY HH:mm"));
       console.log(inicioInt >= desde.toDate().getTime())
       console.log(inicioInt < hasta.toDate().getTime())
 */

      return new Date(o.horainicio).getTime() > moment(this.isActiveTurnObj.idturno_turno.horainicio).add(indi, "h").toDate().getTime()
        && new Date(o.horainicio).getTime() <= moment(this.isActiveTurnObj.idturno_turno.horainicio).add(indi + 1, "h").toDate().getTime()

    })
    //console.log(interruptionsNow);
    for (let int of interruptionsNow) {
      //console.log(int);
      if (int.duracion >= 60) {

        //console.log("mas de 1 minuto dura la interrupcion se mostrara");
        let data = {
          m: moment(int.horainicio).format("mm"),
          type: int.tipo_parada.nombre == 'Baja de velocidad' ? 'warning' : "error",
          // warning: int.tipo_parada.nombre == 'Baja de velocidad',
          f: (+moment(int.horainicio).format("mm") + (int.duracion / 60)) >= 60 ? "60" : moment(int.horainicio).add(int.duracion, "seconds").format("mm"),
          lbl: hora,
          info: int
        }
        //      console.log(data);
        if ((+moment(int.horainicio).format("mm") + (int.duracion / 60)) >= 60) {
//          console.log("SE PASA DE 60  ");
          let horasPasadas = parseInt(((+moment(int.horainicio).format("mm") + (int.duracion / 60)) / 60).toFixed(0))
          //  console.log(horasPasadas);
          for (let i = 0; i < horasPasadas; i++) {
            //         console.log("aaasadsd");
            let data = {
              m: 0,
              type: int.tipo_parada.nombre == 'Baja de velocidad' ? 'warning' : "error",
              f: "60",
              lbl: moment(this.isActiveTurnObj.idturno_turno.horainicio).add(indi + 1 + i, "h").format("HH:00"),
              info: int
            }/*  let data = {
              m: 1,
              type: "error",
              f: (+moment(int.horainicio).format("mm") + (int.duracion /60)) - 60,
              lbl:moment(Date.now()).hours(hora.split(":")[0]).add("1","h").format("HH:00"),
              info:int
            }*/
            if (data.lbl.split(":")[0] == bloqueHoras[bloqueHoras.length - 1].split(":")[0]) {
              data.lbl = bloqueHoras[bloqueHoras.length - 1]
            }
            if (i == (horasPasadas - 1)) {
              // console.log((int.duracion / 60).toFixed(0))
              //console.log((+moment(int.horainicio).format("mm")))
              //console.log((+moment(int.horainicio).format("mm")) + +(int.duracion / 60).toFixed(0))
              data.f = (((+moment(int.horainicio).format("mm") + +(int.duracion / 60).toFixed(0))) - 60 * horasPasadas).toString()
            }
            //  console.log(data);
            this.listaInterrupcionesPorEvento.push(data)
          }
        }

        //console.log(data);
        this.listaInterrupcionesPorEvento.push(data)
      }
    }
    this.loading = false


  }

  private _time$: Observable<Date> = timer(0, 1000).pipe(
    map(tick => new Date()),
    shareReplay(1)
  );

  get time() {
    return this._time$;
  }

  inpuProd() {
    if (this.router.url.includes("produccion-anotar")) {
      location.reload()
    }
    this.router.navigateByUrl("produccion-anotar")
  }

  horas() {
    let horario = this.turnService.horarioValue
    //console.log(horario);
    return horario == 'mañana' ?
      this.horariosManiana : horario == 'tarde' ?
        this.horariosTarde : horario == 'noche' ? this.horariosNoche : ''

  }

  getProductTurn(setPt = true) {
    //this.sensorChartsEnMinutos = true
    this.turnService.getProductTurnByTurn(JSON.parse(localStorage.getItem("activeTurn")).id).subscribe(productTurnsList => {
      this.spSelectedOfTurn = productTurnsList

      this.productTurnList = productTurnsList


      console.log("es todo");
      console.log(productTurnsList);
      this.productTurnListNoDuplicados = Array.from(new Set(productTurnsList.map(o => o.idordendetrabajo))).map(o => {
        return productTurnsList.find(oo => oo.idordendetrabajo == o)
      })


      this.productoTurnoSumas = {
        cantidadesperada: productTurnsList.map(o => o.cantidadesperada || 0).reduce((a, b) => +a + +b, 0),
        cantidadTotal: productTurnsList.map(o => o.idordendetrabajo_ordendetrabajo?.cantidadactual || 0).reduce((a, b) => +a + +b, 0),
        velesperada: productTurnsList.map(o => o.idsubproducto_subproducto?.velprod || 0).reduce((a, b) => +a + +b, 0)
      }
      this.velocidadEsperadaMaq = this.productoTurnoSumas.velesperada


      /*activoenturno: false
      cantidadesperada: 2500
      condicion: "carboniza"
      createdAt: "2022-01-04T01:47:21.024Z"
      formato: "ml"
      formatounidad: "1"
      id: 1
      idordendetrabajo: 2
      idordendetrabajo_ordendetrabajo: {id: 2, idsubproducto: "2", idmaquina: "3", idproceso: "2", horainicio: "2022-01-03T06:46:00.000Z", …}
      idsubproducto: "2"
      idsubproducto_subproducto: {id: 2, nombre: "atropina sulfato", formato: "ml", unidad: "1", condicion: "carboniza", …}
      idturno: "1"
      mermas: null
      serie: null
      updatedAt: "2022-01-04T11:52:21.799Z"
      velocidad: null
*/

      if (setPt) {
        if (this.isActiveTurnObj.idturno_turno.horafin == null) {
          this.productoTurnoActivoTurnoNoTerminado = this.productTurnListNoDuplicados.find(o => o.activoenturno)
          //this.productoTurnoActivo = this.productTurnListNoDuplicados.find(o => o.activoenturno)
          this.productoTurnoActivo = this.productTurnList.find(o => o.activoenturno)
        } else {
          this.productoTurnoActivo = this.productTurnListNoDuplicados.find(o => o.idordendetrabajo == JSON.parse(localStorage.getItem("activeOTpt"))?.idordendetrabajo)
        }
        if (!this.productoTurnoActivo?.id) {
          this.productoTurnoActivo = this.productTurnListNoDuplicados.find(o => o.activoenturno)
        }
        if (this.productoTurnoActivo) {
          localStorage.removeItem("activeOTpt")
          localStorage.setItem("activeOTpt", JSON.stringify(this.productoTurnoActivo))
        }
      }
      this.offsetDelTurno = this.productoTurnoActivo?.idsubproducto_subproducto?.velprod || 0
      this.socketSeries = [
        {name: 'Productos por minuto', series: this.seriesList},
        {
          name: 'Esperado de la máquina', series: this.seriesList.map(o => {
            return {...o, value: this.offsetDelTurno / 60}
          })
        }
      ]
      this.single = [
        {
          "name": "V. esperada",
          "value": this.velocidadEsperadaMaq || 0.1
        },
        {
          "name": "V. actual",
          "value": this.productoTurnoActivo?.velocidad || 0
        }
      ];
      this.mermasPtActivo = this.productoTurnoActivo?.mermas || 0
      this.loading = false
      this.getProductionByProductTurn(this.productoTurnoActivo?.id)

    })

  }


  logout() {
    this.authenticationService.logout()
  }

  terminarActual() {

    //console.log(this.produccionParadaEnCursoObj);

    var startTime = moment(this.produccionParadaEnCursoObj.horainicio);
    var endTime = moment(Date.now());

    let req = {
      "id": this.produccionParadaEnCursoObj.id,
      "duracion": endTime.diff(startTime, 'seconds'),
    }
    // console.log(req);
    this.interruptionService.update(req).subscribe(updatedInterruptin => {
      //console.log(updatedInterruptin);
    })
  }

  confirmar(obj) {
    let req = {
      idcategoriaparada: obj.tipo_parada.idcategoriaparada_categoriadeparada.id,
      nombre: obj.tipo_parada.nombre,
      id: obj.id
    }
    console.log(req);
    console.log(obj);

    this.interruptionService.confirm(req).subscribe(okConfirm => {
      console.log(okConfirm);

      this.turnService.recargarHorasPermitidas()
    })

  }

  menuNewOT() {
    let OTMenus = [
      {
        name: "Crear Orden"
      }, {
        name: "Asociar Orden"
      }
    ]

  }

  openAsociarOrden() {
    this.dialog.open(AsociarOrdenTurnoPasadoComponent, {
      data: {
        listaPt: this.productTurnListNoDuplicados
      },
      height: "80vh",
      width: "70vw"
    }).afterClosed().subscribe(ok => {
      this.turnService.recargarHorasPermitidas()

    })
  }

  otIndex = 0

  cambiarOt(dir) {
    this.loading = true
    if (dir == 'next') {
      if (this.otIndex == this.productTurnListNoDuplicados.length - 1) {
        this.otIndex = 0
      } else {
        this.otIndex += 1
      }
    } else {
      if (this.otIndex == 0) {
        this.otIndex = this.productTurnListNoDuplicados.length - 1
      } else {
        this.otIndex -= 1
      }
    }
    this.productoTurnoActivo = this.productTurnListNoDuplicados[this.otIndex]
    this.Teanimo = false
    this.Teanimo = true
    if (this.productoTurnoActivo) {
      localStorage.removeItem("activeOTpt")
      localStorage.setItem("activeOTpt", JSON.stringify(this.productoTurnoActivo))
    }
    this.getProductTurn(false)
  }


  getProductionByProductTurn(id) {
    this.loading = true
    this.turnService.getAllProductionsByTurn(this.isActiveTurnObj.idturno_turno.id).subscribe((okProduction: any) => {
      let hrsv = moment(parseInt(okProduction.headers.get("lahora")))
      let initur = moment(this.isActiveTurnObj.idturno_turno.horainicio)
      let difference = moment.duration(hrsv.diff(initur))
      this.horasDeProduccion = difference.asHours()
      console.log(okProduction);
      this.todaLaProd = okProduction.body.data
      if (!this.schedulerDataObj.sensor) {
        console.log(this.todaLaProd);
        console.log(Object.keys(this.schedulerDataObj.horas));
        for (let dObj of Object.keys(this.schedulerDataObj.horas)) {
          //this.schedulerDataObj.horas[dObj].produccion = this.todaLaProd.filter(o => o.idprodturn_productoturno.idordendetrabajo == this.productoTurnoActivo.idordendetrabajo && o.cantidad > 0).find(o => o.hora.split(":")[0] == dObj.split(":")[0])
          this.schedulerDataObj.horas[dObj].produccion = this.todaLaProd.filter(o => o.cantidad > 0).filter(o => o.hora.split(":")[0] == dObj.split(":")[0])
        }
        console.log(this.schedulerDataObj);

      }
      let horaIHorario = moment().hours(JSON.parse(localStorage.getItem('activeTurn')).idhorario_horario.horainicio.split(":")[0])
      let horaFHorario = moment().hours(JSON.parse(localStorage.getItem('activeTurn')).idhorario_horario.horafin.split(":")[0])
      console.log(JSON.parse(localStorage.getItem('activeTurn')).idhorario_horario.horainicio)

      let listaHorasReales = []
      console.log(horaIHorario.format("HH"))
      console.log(horaFHorario.format("HH"))
      console.log(horaIHorario.format("HH") != horaFHorario.format("HH"))
      while (horaIHorario.format("HH") != horaFHorario.format("HH")) {

        listaHorasReales.push(horaIHorario.format("HH"))
        horaIHorario.add(1, "h")
      }
      console.log("listaHorasReales")
      console.log(listaHorasReales)

      if (this.isActiveTurnObj.idturno_turno.idmaquina_maquina.conSensor) {
        setTimeout(() => {

          this.turnService.getTurnInitiatedByMachine(this.isActiveTurnObj.idturno_turno.idmaquina_maquina.id).subscribe(okTurnInit => {
            /*
               this.turnService.initOne({id: this.isActiveTurnObj.idturno_turno.idmaquina_maquina.id}, false).subscribe(okTurnInit => {
            */

            this.totalProdActual = okTurnInit?.prodtotal - this.mermasPtActivo

            let listaDetProd: any = okProduction.body
            let recordsProductoActivo = listaDetProd.data.filter(o => o.idprodturn_productoturno.idordendetrabajo == this.productoTurnoActivo?.idordendetrabajo || null)


            let listaOrdenadaProd = recordsProductoActivo.sort((a, b) =>
              moment(a.dateH).toDate().getTime()
              -
              moment(b.dateH).toDate().getTime()
            )
            this.seriesListHora = listaOrdenadaProd.map(o => {
              return {
                name: moment(o.dateH).format("HH:mm"),
                value: o.cantidad
              }
            })
            this.seriesListHora = listaHorasReales.map(o => {
              return {
                name: o,
                value: this.seriesListHora.find(oo => oo.name.split(":")[0] == o) ?
                  this.seriesListHora.find(oo => oo.name.split(":")[0] == o).value : 0
              }
            })
            console.log("seriesListHora");
            console.log(this.seriesListHora);
            console.log(listaHorasReales.map(o => {
              console.log(o)
              console.log(this.seriesListHora.find(oo => {
                console.log(oo.name.split(":")[0]);
                console.log(oo.name.split(":")[0] == o);
                return oo.name.split(":")[0] == o

              }))
              return {
                name: o,
                value: this.seriesListHora.find(oo => oo.name.split(":")[0] == o) ?
                  this.seriesListHora.find(oo => oo.name.split(":")[0] == o).value : undefined
              }
            }));


            this.socketSeries = [
              {name: 'Productos por minuto', series: this.seriesList},
              {
                name: 'Esperado de la máquina', series: this.seriesList.map(o => {
                  return {...o, value: this.offsetDelTurno / 60}
                })
              }
            ]

            /* this.socketSeries = [
               {name: 'Productos por hora', series: this.seriesListHora},
               {name: 'Esperado de la máquina', series: this.seriesList.map(o=>{return {...o,value:this.offsetDelTurno}})}

             ]*/


            let totalSumaRecords = recordsProductoActivo.map(o => o.cantidad || 0).reduce((a, b) => +a + +b, 0)
            this.totalProdTurnoActivo = totalSumaRecords
            this.totalProdActual = (this.productoTurnoActivo?.idordendetrabajo_ordendetrabajo?.cantidadactual ?
              this.productoTurnoActivo.idordendetrabajo_ordendetrabajo?.cantidadactual : totalSumaRecords) - this.mermasPtActivo


            console.log(okTurnInit);
            //this.totalPercent = ((this.totalProdActual * 100) / (this.standardProduction * this.horasDeProduccion)).toFixed(2)
            console.log(this.isActiveTurnObj);
            if (this.isActiveTurnObj.idturno_turno.produccionesperada > 0) {
              this.totalPercent = this.isActiveTurnObj.idturno_turno.produccionesperada > 0 ?
                Math.trunc(((this.totalProdActual * 100) / okTurnInit.produccionesperada)) : 100
            } else {
              console.log(this.productoTurnoActivo);
              this.totalPercent = Math.trunc(((this.totalProdActual * 100) / this.productoTurnoActivo?.idordendetrabajo_ordendetrabajo?.cantidadesperada))

            }

          }, error => {
            this.totalProdActual = this.isActiveTurnObj.idturno_turno.prodtotal - this.mermasPtActivo
            this.totalPercent = this.isActiveTurnObj.idturno_turno.produccionesperada > 0 ?
              Math.trunc(((this.totalProdActual * 100) / this.productoTurnoActivo?.cantidadesperada)) : 100
          })
        }, 0)
      } else {
        let listaDetProd: any = okProduction.body
        let recordsProductoActivo = listaDetProd.data.filter(o => o.idprodturn_productoturno.idordendetrabajo == this.productoTurnoActivo.idordendetrabajo)
        let totalSumaRecords = recordsProductoActivo.map(o => o.cantidad || 0).reduce((a, b) => +a + +b, 0)
        this.totalProdTurnoActivo = totalSumaRecords
        console.log(totalSumaRecords);
        console.log(this.mermasPtActivo);
        /*    this.seriesList.push({name: moment(dataSensor.timestamp).format("HH:mm:ss"), value: dataSensor.produccion})
            if (this.seriesList.length == 11) {
              this.seriesList.shift()
            }
            this.socketSeries = [{name: 'Productos por minuto', series: this.seriesList}]
    */
        let listaOrdenadaProd = okProduction.body.data.sort((a, b) =>
          moment(a.dateH).toDate().getTime()
          -
          moment(b.dateH).toDate().getTime()
        )

        console.log("listaOrdenadaProd");
        console.log(listaOrdenadaProd);


        let manualSeriesList = listaOrdenadaProd.map(o => {
          return {
            name: moment(o.dateH).format("HH:mm"),
            value: o.cantidad
          }
        })
        console.log(manualSeriesList);

        /*
        console.log(listaHorasReales.map(o=>{
          return {
            name: o,
            value: manualSeriesList.find(oo=>oo.name.split(":")[0] == o) ?
              manualSeriesList.find(oo=>oo.name.split(":")[0] == o).cantidad : undefined
          }
        }))*/
        manualSeriesList = listaHorasReales.map(o => {
          return {
            name: o,
            value: manualSeriesList.find(oo => oo.name.split(":")[0] == o) ?
              manualSeriesList.find(oo => oo.name.split(":")[0] == o).cantidad : undefined
          }
        })
        console.log(manualSeriesList);
        this.manualSeries = [
          {name: 'Productos por hora', series: manualSeriesList},
          {
            name: 'Esperado de la máquina', series: this.seriesList.map(o => {
              return {...o, value: this.offsetDelTurno}
            })
          }
        ]
        //this.manualmanualSeriesList = this.manualSeries


        this.totalProdActual = (this.productoTurnoActivo?.idordendetrabajo_ordendetrabajo?.cantidadactual ?
          this.productoTurnoActivo.idordendetrabajo_ordendetrabajo?.cantidadactual : totalSumaRecords) - this.mermasPtActivo
        //this.totalProdActual = this.productoTurnoSumas.cantidadTotal
        console.log(this.totalProdActual);
        if (this.isActiveTurnObj.idturno_turno.produccionesperada > 0) {
          this.totalPercent = this.isActiveTurnObj.idturno_turno.produccionesperada > 0 ?
            Math.trunc(((this.totalProdActual * 100) / this.productoTurnoActivo?.cantidadesperada)) : 100
        } else {
          this.totalPercent = Math.trunc(((this.totalProdActual * 100) / this.productoTurnoActivo?.idordendetrabajo_ordendetrabajo?.cantidadesperada || 0))
          //this.totalPercent = Math.trunc(((this.totalProdActual * 100) / this.productoTurnoSumas.cantidadesperada))
          console.log(this.totalPercent);
        }

      }
      //this.totalPercent = ((this.totalProdActual * 100) / (this.standardProduction * this.horasDeProduccion)).toFixed(2)

      /* for (let i = 0; i < this.productTurnList.length; i++) {
         if (this.productTurnList[i].id == id) {
           // console.log("si");
           //console.log(i);
           let hours = {}

           /!* function subirHora(fechaI, alm) {
              if (fechaI.getTime() > fecha.getTime()) {
                return false
              } else {
                let horaSumada = moment(fechaI)
                alm.push(horaSumada.format("HH:mm"))
                horaSumada.add(1, 'hours')
                subirHora(horaSumada.toDate(), alm)
              }
            }
            let horaTurno = new Date(this.isActiveTurnObj.idturno_turno.horainicio).getHours()

            this.settingsService.getAll().subscribe(horasHorarios => {

            })
  *!/


           for (let h of this.turnService.dataAllowedHoursManagerValue) {
             let name = h
             hours[h.split(":")[0] + ":00"] = {
               name: h.split(":")[0] + ":00",
               cantidad: 0
             }

           }
           for (let hExistent of productionOfProductTurn) {
             //console.log(hours);
             //console.log(hExistent);
             for (let h of Object.keys(hours)) {
               if (h.substring(0, 5) == hExistent.hora) {
                 hours[h].cantidad = hExistent.cantidad
               }
             }
           }
           // console.log(hours);
           this.horasProdObj = hours

          /!* for (let h of Object.keys(hours)) {
             if (hours[h].cantidad) {
               this.totalProdActual += +hours[h].cantidad
             }
           }*!/
           console.log(this.totalProdActual);
           console.log(this.horasDeProduccion);
           console.log(this.standardProduction);
           this.totalPercent = ((this.totalProdActual * 100) / (this.standardProduction * this.horasDeProduccion)).toFixed(2)
           if (this.totalProdActual == 0) {
             this.totalPercent = 0
           }

           console.log(this.totalPercent);

           /!* console.log(productionOfProductTurn);
            let existent = productionOfProductTurn.find(o => o.hora == h.substring(0, 5))
            if (existent) {
              hours[h].cantidad = existent.cantidad
            }*!/
           this.productTurnList[i].horas = hours
           // console.log(this.productTurnList);

         }
       }*/
      setTimeout(() => {
        this.cambiarChart(false)
      }, 400)
      this.loading = false


    })
  }


  openFullscreen() {

    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }


  openDetentions() {
    const dialogRef = this.dialog.open(AlertDetentionComponent, {
      data: {
        activeTurn: this.isActiveTurnObj
      }

    })
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openMermas() {
    this.loading = true

    const dialogRef = this.dialog.open(MermasManagerComponent, {data: this.productoTurnoActivo})
    dialogRef.afterClosed().subscribe(result => {
      //  this.turnService.refreshActiveTurns()
      this.getProductTurn()
    });
  }

  openVelocidad() {
    const dialogRef = this.dialog.open(VelocidadManagerComponent, {
      data: {
        ...this.isActiveTurnObj,
        pt: this.productoTurnoActivo
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      this.getProductTurn()
    });
  }


  goTablaProd() {
    this.turnService.tablaProdChangeValue(true)
  }

  toFullScreen() {
    this.isFullScreen = !this.isFullScreen
    if (!this.isFullScreen) {
      this.closeFullscreen()
    } else {
      console.log("pantalla completa");
      this.openFullscreen()
    }
  }

  endTurn() {
    this.loading = true
    let idTurno = JSON.parse(localStorage.getItem("pendingTurns"))[0].id
    // this.closeFullscreen()
    // this.isActiveTurn = false;
    this.turnService.end(idTurno).subscribe(ok => {
      localStorage.removeItem("pendingTurns")
      localStorage.removeItem("activeTurn")
      localStorage.removeItem("activeOTpt")
      this.turnService.refreshActiveTurns()
      console.log(ok)
      this.turnService.dataManagerChangeValue(false)
      this.closeFullscreen()
      this.router.navigateByUrl("plantas")

    })
    /*return Swal.fire({
      title: '¿Terminar el turno?',
      text: `Estas a punto de terminar el turno, ¿deseas continuar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Terminar',
      cancelButtonText: 'No,  Cancelar'
    }).then(ok => {
      if (ok.isConfirmed) {
        let idTurno = this.turnService.activeTurnsValue[0].id
        // this.closeFullscreen()
        // this.isActiveTurn = false;
        this.turnService.end(idTurno).subscribe(ok => {
          localStorage.removeItem("pendingTurns")
          localStorage.removeItem("activeTurn")
          this.turnService.refreshActiveTurns()
          console.log(ok)
          this.turnService.dataManagerChangeValue(false)
          this.closeFullscreen()

        })
      }
    })*/


  }

  eliminarPt(idPt) {
    this.loading = true
    this.turnService.deleteProductTurn(idPt).subscribe(ok => {
      console.log(ok);
      this.turnService.recargarHorasPermitidas()

    })
  }

  ngAfterContentInit() {
    AppComponent.isSticky = false

  }


  ngOnDestroy(): void {
    AppComponent.isSticky = true
    this.suscriptionObject.unsubscribe()
    this.subscriptionObject.unsubscribe()
  }


}
