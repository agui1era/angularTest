import {Component, OnInit} from '@angular/core';
import {OeeService} from "@app/_services/oee.service";
import {MachineService} from "@app/_services/machine.service";
import {ProductService} from "@app/_services/product.service";
import {SubproductService} from "@app/_services/subproduct.service";
import * as moment from "moment";
import {Chart} from "angular-highcharts";

@Component({
  selector: 'app-analitica',
  templateUrl: './analitica.component.html',
  styleUrls: ['./analitica.component.sass']
})
export class AnaliticaComponent implements OnInit {
  graficoPareto = true
  lasParadas: any = []
  lasParadasResp: any = []
  lasMants: any = []
  lasMantsResp: any = []
  listaOLES: any = []
  listaIndicadoresMant: any = []
  chart = new Chart({
    chart: {
      type: 'column'
    },
    colors: ['#ff7416'],
    title: {
      text: 'Paradas'
    },
    tooltip: {
      shared: true

    },
    xAxis: {
      categories: ["Falta agua", "colacion", "mantencion"],
      crosshair: true
    },
    yAxis: [{
      title: {
        text: ''
      }
    }, {
      title: {
        text: ''
      },
      minPadding: 0,
      maxPadding: 0,
      max: 10,
      min: 0,
      opposite: true,
      labels: {
        format: "{value}%"
      }
    }],
    series: [{
      type: 'pareto',
      name: 'Porcentaje acumulado',
      yAxis: 1,
      zIndex: 10,
      baseSeries: 1,
      tooltip: {
        valueDecimals: 2,
        valueSuffix: '%'
      }
    }, {
      name: 'Porcentaje',
      type: 'column',
      color: "#4fa1ff",
      zIndex: 2,
      data: [50, 30, 20]
    }]
  });

  selectedMachine: any = null
  selectedTipo: any = "diario"
  selectedDate: any = moment().format("YYYY-MM-DD")


  singleData = [
    {
      "name": "Germany",
      "value": 40632,
      "extra": {
        "code": "de"
      }
    },
    {
      "name": "United States",
      "value": 50000,
      "extra": {
        "code": "us"
      }
    },
    {
      "name": "France",
      "value": 36745,
      "extra": {
        "code": "fr"
      }
    },
    {
      "name": "United Kingdom",
      "value": 36240,
      "extra": {
        "code": "uk"
      }
    },
    {
      "name": "Spain",
      "value": 33000,
      "extra": {
        "code": "es"
      }
    },
    {
      "name": "Italy",
      "value": 35800,
      "extra": {
        "code": "it"
      }
    }
  ]
  multiDD = [
    {
      "name": "Maquina A",
      "series": [
        {
          "name": "OLE",
          "value": 78,

        },
        {
          "name": "OLE LOSS",
          "value": 22,
        }
      ]
    },
    {
      "name": "Maquina B",
      "series": [
        {
          "name": "OLE",
          "value": 20,

        },
        {
          "name": "OLE LOSS",
          "value": 80,

        }
      ]
    },
  ]
  indicadoresListaOLE: any = []
  indicadoresListaTL: any = []
  indicadoresListaC: any = []
  indicadoresList: any = []
  indicadoresListResp: any = []
  fechasDisponibles = []
  fechaSelected: any = ""
  maquinaSelected: any = ""
  productoSelected: any = ""
  maquinasDisponibles = []
  productosDisponibles = []
  tipoSeleccionado: any = ""
  dataParDeDatos: any = []
  allMachines = []

  constructor(
    private oeeService: OeeService,
    private machineService: MachineService,
    private subproductService: SubproductService
  ) {
  }


  async ngOnInit(): Promise<void> {
    //this.indicadoresList = await this.oeeService.analiticaIndicadores().toPromise()
    this.allMachines = await this.machineService.getAll().toPromise()
    let query = {
      /* tipo: "diario",
       fecha: 1648778117000,
       idmaquina: "1"*/
    }
    /*    this.indicadoresListResp = await this.oeeService.analiticaIndicadoresPost(query).toPromise()
        let maquinasInd = this.indicadoresListResp.indicadores.map(o => o.maquina)


        console.log(this.indicadoresListResp.indicadores.filter(o => o.indicador == "OEE"));
        console.log(maquinasInd);
        this.listaOLES = this.indicadoresListResp.indicadores.filter(o => o.indicador == "OEE")
          .map(o => {
            return {
              name: `${o.idmaquina_maquina.nombre}`,
              series: [
                {
                  "name": "OLE",
                  "value": o.valor,

                },
                {
                  "name": "OLE LOSS",
                  "value": 100 - o.valor,

                }
              ]
            }
          })*/


    /* let paradasResp: any = await this.oeeService.analiticaAllParadas(null).toPromise()
     this.lasParadasResp = paradasResp.dataResp
     this.lasParadas = this.lasParadasResp
     console.log(this.lasParadas);
     let paradasList = paradasResp.allInterruptions
     paradasList.sort((a, b) =>  b.duracion - a.duracion)
     this.paretoInit(
       paradasList.map(o => o.tipo_parada.nombre),
       paradasList.map(o => o.duracion / 60)
     )*/
    /* this.lasMantsResp = await this.oeeService.analiticaAllMants().toPromise()
     this.lasMants = this.lasMantsResp*/
    this.buscar()
  }

  paretoInit(paradas, duraciones) {


    this.chart = new Chart({
      chart: {
        type: 'column'
      },
      colors: ['#ff7416'],
      title: {
        text: 'Paradas'
      },
      tooltip: {
        shared: true

      },
      xAxis: {
        categories: paradas,
        crosshair: true
      },
      yAxis: [{
        title: {
          text: ''
        }
      }, {
        title: {
          text: ''
        },
        minPadding: 0,
        maxPadding: 0,
        max: 100,
        min: 0,
        opposite: true,
        labels: {
          format: "{value}%"
        }
      }],
      series: [{
        type: 'pareto',
        name: 'Porcentaje acumulado',
        yAxis: 1,
        zIndex: 10,
        baseSeries: 1,
        tooltip: {
          valueDecimals: 2,
          valueSuffix: '%'
        }
      }, {
        name: 'Porcentaje',
        type: 'column',
        color: "#4fa1ff",
        zIndex: 2,
        data: duraciones
      }]
    });
  }

  cambiarParadas(tipo) {
    switch (tipo) {
      case 'all':
        this.lasParadas = this.lasParadasResp
        break;
      case 'PDL':
        this.lasParadas = this.lasParadasResp.filter(o => o.tipo == 'PDL')
        break;
      case 'MPL':
        this.lasParadas = this.lasParadasResp.filter(o => o.tipo == 'MPL')
        break;
    }
  }

  seleccionarTipo() {
    console.log(this.tipoSeleccionado);
    console.log(this.indicadoresListResp);
    this.indicadoresList = this.indicadoresListResp.filter(indicador => indicador.tipo == this.tipoSeleccionado)
    console.log(this.indicadoresList)

    if (this.indicadoresList.length > 0) {
      this.fechasDisponibles = Array.from(new Set(this.indicadoresList.map(o => o.ts)))
      this.maquinasDisponibles = this.indicadoresList.map(oo => {
          let obj: any = {}
          obj.maquina = this.allMachines.find(o => o.id == oo.maquina)
          return obj
        }
      )
      this.productosDisponibles = Array.from(new Set(this.indicadoresList.map(o => o.subproducto)))
      this.productosDisponibles = this.productosDisponibles.map(o => {
          let obj: any = {}
          this.subproductService.getById(o).subscribe(okMaq => {
            obj.producto = okMaq
          })
          return obj
        }
      )

    }
    this.crearDataParDeDatos()

  }

  crearDataParDeDatos() {
    if (this.indicadoresList.length > 0) {
      let obj = {}
      this.dataParDeDatos = []
      let maquinasDispo = Array.from(new Set(this.indicadoresList.map(o => o.maquina)))
      for (let m of maquinasDispo) {
        let indicatorsList: any = Array.from(new Set(this.indicadoresList.filter(o => o.maquina == m)))
        let objIndi: any = {}
        for (let indic of indicatorsList) {
          console.log(indic);
          objIndi = {
            maquina: indic.maquina,
            name: indic.indicador,
            valor: indic.valor,
          }
          objIndi.maquina = this.allMachines.find(o => o.id == indic.maquina)
          this.dataParDeDatos.push(objIndi)
        }
      }
    }
    console.log(this.dataParDeDatos);
  }


  buscar() {
    let queryP = {
      "tipo": this.selectedTipo,
      "fecha": moment(this.selectedDate).toDate().getTime(),
      "idmaquina": this.selectedMachine
    }
    console.log(queryP);
    this.oeeService.analiticaIndicadoresPost(queryP).subscribe((okIndis: any) => {
      console.log(okIndis);
      this.listaOLES = okIndis.indicadores.filter(o => o.indicador == "OEE")
        .map(o => {
          return {
            name: `${o.idmaquina_maquina.nombre}`,
            series: [
              {
                "name": "OLE",
                "value": o.valor,

              },
              {
                "name": "OLE LOSS",
                "value": 100 - o.valor,

              }
            ]
          }
        })
      let maquinasInd = Array.from(new Set(okIndis.indicadores.map(o => o.maquina)))
      for (let mi of maquinasInd) {
        /*  console.log(okIndis.indicadores.filter(o => o.maquina == mi)
            .map(o => o.indicador)
            .map(o => okIndis.indicadores
              .filter(oo => oo.maquina == mi)
              .filter(ooo => ooo.indicador == o).map(j => {
                return {
                  [j.indicador]: j.valor
                }
              })))*/
        let objInd = {}
        for (let oi of okIndis.indicadores.filter(o => o.maquina == mi)
          .map(o => o.indicador)) {
          objInd[oi] = okIndis.indicadores.find(o => o.maquina == mi && o.indicador == oi).valor
        }
        objInd["maquina"] = this.allMachines.find(o => o.id == mi)
        this.indicadoresListaOLE.push(objInd)
      }
      console.log(this.indicadoresListaOLE);
    })

    let query2 = {
      "selectedFecha": moment(this.selectedDate).format("YYYY-MM-DD"),
      "selectedMachine": this.selectedMachine
    }

    let filtroQuery = Object.keys(query2).filter(o => query2[o] != null)
      .map(o => `${o}=${query2[o]}`).join("&")
    this.oeeService.analiticaAllParadas(`?${filtroQuery}`).subscribe((okParadasAll:any) => {
      let paradasResp: any = okParadasAll
      this.lasParadasResp = paradasResp.dataResp
      this.lasParadas = this.lasParadasResp
      console.log(paradasResp.pareto);
      this.paretoInit(
        Object.keys(paradasResp.pareto),
        Object.values(paradasResp.pareto)
      )
      this.oeeService.analiticaAllMants(`?${filtroQuery}`).subscribe((okListMants: any) => {
        this.lasMantsResp = okListMants.dataResp
        this.lasMants = this.lasMantsResp
        this.listaIndicadoresMant = okListMants.indicadoresMant
        for(let mm of this.listaIndicadoresMant){
          mm.fallaTime = okParadasAll.machinss.find(o=>o.id == mm.maquina.id)?.fallaTime
          mm.tiempoFallaPorcentaje = (mm.fallaTime * 100) / mm.tiempoTotal
        }

      })
    })
  }
}
