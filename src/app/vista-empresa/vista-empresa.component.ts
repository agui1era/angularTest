import {Component, OnInit} from '@angular/core';
import {PlantService} from "@app/_services/plant.service";
import {ProcessService} from "@app/_services/process.service";
import {MachineService} from "@app/_services/machine.service";
import {OeeService} from "@app/_services/oee.service";
import {TurnService} from "@app/_services/turn.service";
import {AppComponent} from "@app/app.component";
import {Alerts} from "@app/_helpers/alerts";
import * as moment from "moment";

@Component({
  selector: 'app-vista-empresa',
  templateUrl: './vista-empresa.component.html',
  styleUrls: ['./vista-empresa.component.sass']
})
export class VistaEmpresaComponent implements OnInit {
  panelOpenState = false;
  loading = true
  procesoSelected: any = "";
  allPlants = []
  allProcesos = []
  oeeDataPlant: any = {}
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  vistaProd = false

  gaugeValues: any = {
    1: 100,
    2: 50,
    3: 50,
    4: 50,
    5: 50,
    6: 50,
    7: 50,
  };
  velpromedioProd = 0
  saleData = [
    {name: "Mobiles", value: 105000},
    {name: "Laptop", value: 55000},
    {name: "AC", value: 15000},
    {name: "Headset", value: 150000},
    {name: "Fridge", value: 20000}
  ];

  multiData = [
    {
      "name": "Germany",
      "series": [
        {
          "name": "1990",
          "value": 62000000
        },
        {
          "name": "2010",
          "value": 73000000
        },
        {
          "name": "2011",
          "value": 89400000
        }
      ]
    },

    {
      "name": "USA",
      "series": [
        {
          "name": "1990",
          "value": 250000000
        },
        {
          "name": "2010",
          "value": 309000000
        },
        {
          "name": "2011",
          "value": 311000000
        }
      ]
    },

    {
      "name": "France",
      "series": [
        {
          "name": "1990",
          "value": 58000000
        },
        {
          "name": "2010",
          "value": 50000020
        },
        {
          "name": "2011",
          "value": 58000000
        }
      ]
    },
    {
      "name": "UK",
      "series": [
        {
          "name": "1990",
          "value": 57000000
        },
        {
          "name": "2010",
          "value": 62000000
        }
      ]
    }
  ]


  allDataOfPlant: any = []
  isActiveTurn = false
  allInDetention = []
  allInMaintenance = []
  allMachinesExistent = []

  constructor(
    private plantServie: PlantService,
    private alerts: Alerts,
    private processService: ProcessService,
    private machineService: MachineService,
    private oeeService: OeeService,
    private turnService: TurnService
  ) {
  }

  ngOnInit(): void {
    this.plantServie.getAll().subscribe(ok => {
      this.allPlants = ok
      //this.llamarProcesos(ok[0])
//      console.log(this.allPlants);
    })
    this.processService.getAll().subscribe(ok => {
      this.allProcesos = ok
      if (this.allProcesos.length > 0) {
        this.procesoSelected = this.allProcesos[0].id
      }
    })


  }

  llamarProcesos(planta) {
    this.allDataOfPlant = []


    this.loading = true

    this.oeeService.oeeByPlant(planta.id).subscribe(async (okOeePlant: any) => {
      this.oeeDataPlant = okOeePlant
      for (let proc of okOeePlant.procesos) {
        console.log(proc.maquinas);
        proc.operativas = proc.maquinas.filter(o => o.estado == "operativa").length
        proc.mantenciones = proc.maquinas.filter(o => o.estado == "mantenimiento").length
        proc.detenidas = proc.maquinas.filter(o => o.estado == "detenida").length
        for (let mOfP of proc.maquinas) {
          mOfP.horasPermitidas = []
          mOfP.horasProduccion = mOfP.lastTurn?.lastTurn[0].productoturnos[0].detproduccions
          mOfP.horasProduccion = mOfP?.horasProduccion?.flat() || []

          let fechaI = moment(mOfP.lastTurn?.lastTurn[0].horainicio).subtract(1, "hour")
          for (let i = 0; i < mOfP.lastTurn?.lastTurn[0].horastotales; i++) {
            mOfP.horasPermitidas.push(fechaI.add(1, 'hour').format('HH:mm'))
          }
          mOfP.grafico = []

          let dataObj = {}
          dataObj["name"] = "Actual"
          dataObj["series"] = mOfP.horasPermitidas.map(o => {
            return {
              "name": o,
              "value": mOfP.horasProduccion.filter(p => p.hora == o)[0]?.cantidad || 0
            }
          })

          mOfP.grafico.push(dataObj)
          mOfP.prodEsperado = {
            "name": "Esperado",
            "value": mOfP.lastTurn?.lastTurn[0].productoturnos[0]?.idsubproducto_subproducto?.velprod || 0
          }
          /*let dataObj2 = {}

          dataObj2["name"] = "Esperado"
          dataObj2["series"] = mOfP.horasPermitidas.map(o => {
            return {
              "name": o,
              "value": mOfP.lastTurn.lastTurn[0].productoturnos[0]?.idsubproducto_subproducto?.velprod || 0
            }
          })

          mOfP.grafico.push(dataObj2)*/
          mOfP.velpromedioProd = (mOfP.horasProduccion.map(o => o.cantidad).reduce((a, b) => +a + +b, 0) / mOfP.horasProduccion.length) || 0

          /*  for (let laH of mOfP.horasPermitidas) {



              mOfP.grafico.push(dataObj)
            }*/


          /*  mOfP.grafico = [
              {
                "name": "hora",
                "series": [
                  {
                    "name": "Actual",
                    "value": 62000000
                  },
                  {
                    "name": "Esperado",
                    "value": 73000000
                  }
                ]
              },]*/


        }
      }
      console.log(okOeePlant);
      this.loading = false
    })


    /* console.log("procesos de ");
     console.log(planta);*/
    /* this.machineService.getAll().subscribe(allMachinesForCount => {
       this.allMachinesExistent = allMachinesForCount
     })
     this.machineService.getAllInDetention().subscribe(okInDetentions => {
       this.allInDetention = okInDetentions
       this.machineService.getAllInMaintenance().subscribe(okInMaintenance => {
         this.allInMaintenance = okInMaintenance


         /!*this.processService.getAll().subscribe(ok => {
           planta.procesos = ok.filter(o => o.idplanta == planta.id)
           if (planta.procesos.length == 0) {
             this.loading = false
           }
           for (let pro of planta.procesos) {

             this.oeeService.oeeByProcess(pro.id).subscribe((okProOee: any) => {
               console.log(okProOee);
               pro.oee = okProOee.oee * 100 || 0

               this.machineService.getAll().subscribe(ok => {

                 pro.maquinas = ok.filter(o => o.idproceso == pro.id)
                 if (pro.maquinas.length == 0) {
                   this.loading = false
                 }

                 for (let maq of pro.maquinas) {

                   this.oeeService.oeeByMachine(maq.id).subscribe(oeeOK => {
                     console.log(oeeOK);
                     maq.oee = oeeOK

                     maq.oee.rendimiento = maq.oee.rendimiento == null ? 0:maq.oee.rendimiento || 0
                     maq.oee.calidad = maq.oee.calidad == null ? 0:maq.calidad
                     maq.oee.disponibilidad = maq.oee.disponibilidad == null ? 0:maq.oee.disponible
                     maq.oee.oee = isNaN(maq.oee.oee)  ? 0:maq.oee.oee || 0
                     console.log(maq);

                     if (maq == pro.maquinas[pro.maquinas.length - 1]) {
                       this.loading = false
                     }
                     if (this.allInDetention.find(o => o.tipo_parada.paradamaquinas[0].idmaquina == maq.id)) {
                       // console.log(`maquina  en detencion 0 ${maq.nombre} ${JSON.stringify(maq)}`)
                       maq.inDetention = true
                     }
                     if (this.allInMaintenance.find(o => o.tipo_parada.paradamaquinas[0].idmaquina == maq.id)) {
                       // console.log(`maquina  en mantencion 0 ${maq.nombre} ${JSON.stringify(maq)}`)
                       maq.inMaintenance = true
                     }
                   })
                 }
                 console.log(pro.maquinas);
                 setTimeout(() => {
                   /!* let sumoe = 0
                    let listoee = pro.maquinas.map(o=>o.oee?.oee)
                    for(let oe of listoee){
                      sumoe += +oe || 0
                    }*!/
                   pro.oee = 1

                 }, 3000)

                 this.allDataOfPlant.push({...pro})

               })
             })
           }
         })*!/
       })


     })*/
  }

  llamarMaquinas(proceso, event) {
    if (event.target.className.includes("procesoDiv") || event.target.className.includes("procnombre")) {
      console.log("maquinas de ");
      console.log(proceso);
      this.machineService.getAll().subscribe(ok => {


        proceso.maquinas = ok.filter(o => o.idproceso == proceso.id)

        for (let maq of proceso.maquinas) {
          this.oeeService.oeeByMachine(maq.id).subscribe(oeeOK => {
            console.log(oeeOK);
            maq.oee = oeeOK
          })
        }
      })
    }
  }

  get anch() {
    return window.innerWidth
  }

  getChicodo() {
    return AppComponent.achicadoo
  }

  irAlTurnoMaquina(maquina) {
    this.turnService.getTurnInitiatedByMachine(maquina.id).subscribe(okInitOne => {
      this.turnService.getTurnOfTodayByMachine(maquina.id).subscribe(okTurnsMachine => {
        if (okTurnsMachine.length >= 1) {
          this.turnService.dataActiveTurnsManagerChangeValue([okTurnsMachine[0]].map(o => {
            return {idturno_turno: {...o}, idturno: o.id}
          }))
          this.turnService.activeTurnObjManagerChangeValue(okTurnsMachine[0])
          this.vistaProd = true
          this.isActiveTurn = true
        } else {
          this.alerts.errorAlert({error: "No existen turnos iniciados"})
        }
      })
    }, error => {
      this.turnService.getTurnOfTodayByMachine(maquina.id).subscribe(okTurnsMachine => {
        if (okTurnsMachine.length >= 1) {
          this.turnService.dataActiveTurnsManagerChangeValue([okTurnsMachine[0]].map(o => {
            return {idturno_turno: {...o}, idturno: o.id}
          }))
          this.turnService.activeTurnObjManagerChangeValue(okTurnsMachine[0])
          this.vistaProd = true
          this.isActiveTurn = true
        } else {
          this.alerts.errorAlert({error: "No existen turnos iniciados"})
        }
      })
    })


  }

  yourFn($event, plantas) {
    console.log($event);
    this.llamarProcesos(plantas[$event.index])

  }

  operativas(lista) {

    return lista.filter(o => {
      return !this.allInMaintenance.find(oo => oo.tipo_parada.paradamaquinas[0].idmaquina == o.id) &&
        !this.allInDetention.find(oo => oo.tipo_parada.paradamaquinas[0].idmaquina == o.id)
    }).length


  }

  detenidas(lista) {
    return lista.filter(o => {
      return this.allInDetention.find(oo => oo.tipo_parada.paradamaquinas[0].idmaquina == o.id)
    }).length
  }

  mantenciones(lista) {
    return lista.filter(o => {
      return this.allInMaintenance.find(oo => oo.tipo_parada.paradamaquinas[0].idmaquina == o.id)
    }).length
  }

  promedioDeProceso(idproceso) {
  }


}
