import {Component, OnInit, ViewChild} from '@angular/core';
import {MachineService} from "@app/_services/machine.service";
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import {InterruptionService} from "@app/_services/interruption.service";
import {PlantService} from "@app/_services/plant.service";
import {ProcessService} from "@app/_services/process.service";
import {printDiv} from "@app/_helpers/print-div";
import * as moment from "moment";
import {SubproductService} from "@app/_services/subproduct.service";
import {ReportesService} from "@app/_services/reportes.service";
import {Chart} from 'angular-highcharts';
import {MatDialog} from "@angular/material/dialog";
import {BasicMenuComponent} from "@app/basic-menu/basic-menu.component";
import {ReportesPlanillaProductosComponent} from "@app/reportes-planilla-productos/reportes-planilla-productos.component";
import {OrdenDeTrabajoService} from "@app/_services/ordenDeTrabajo.service";
import {OeeService} from "@app/_services/oee.service";
import {OrdenDeTrabajoMermaService} from "@app/_services/ordenDeTrabajoMerma.service";
import {Angular2CsvComponent} from "angular2-csv";
import {ColDef} from "ag-grid-community";

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.sass']
})
export class ReportesComponent implements OnInit {
  @ViewChild(Angular2CsvComponent) csvComponent: Angular2CsvComponent;
  comienzaBusqueda = false
  panelOpenState = false
  errorMessage = ""
  csvOptions: any = {}
  csvData: any = {}
  saleData = [
    {name: "Mobiles", value: 105000},
    {name: "Laptop", value: 55000},
    {name: "AC", value: 15000},
    {name: "Headset", value: 150000},
    {name: "Fridge", value: 20000}
  ];
  columnDefs: ColDef[] =  [
    {headerName:'Máquina', field: 'maqiNombre',sortable:true,filter:true },
    {headerName:' Planificado / Un.', field: 'cantidadesperada',sortable:true,filter:true },
    {headerName:'Producido', field: 'cantidadactual',sortable:true,filter:true },
    {headerName:'Faltante / Un.', field: 'faltante',sortable:true,filter:true },
  ];
  rowData = [

  ];
  ordenesDeTrabajoList: any = []
  ordenesDeTrabajoListPorMaquina: any = []
  mermaDataList: any = []
  mermaDonaPorMaquina: any = []
  mermaDonaPorMaquinaColor: any = []
  mermaDonaPorTipo: any = []
  resumenOtPendings: any = []
  resumenOtPendingsDona: any = []
  resumenOtPendingsMaquinas: any = []
  resumenMantPendings: any = []
  resumenMantPendingsDona: any = []
  resumenMantPendingsDonaColors: any = []
  resumenMantPendingsMaquinas: any = []
  mermaDonaPorTipoColor: any = []
  mermasTotales: any = []
  totalDeLaProduccionOTS: any = 0
  totalDelasOTPendingsYNo: any = 0
  totalDelasMantPendingsYNo: any = 0
  mermasBarraTipoList: any = [{
    name: 'Sin tipo',
    series: [{
      name: 'Sin tipo',
      value: 100
    }]
  }]
  mermasBarraColores: any = {domain: ['#73700c', '#730c65', '#316b63']}
  mermasBarraColoresSYP: any = []
  mermasBarraScrapYProducido: any = []
  mermasOrdenesDeTrabajoMermas: any = []
  stockPorMaquinas: any = []
  stockDonaPorMaquina: any = []
  stockTotal: any = 0
  totalProdMasMermas: any = 0
  produccionProgreso: any = 0
  totalDeResiduos: any = 0
  scrapProgreso: any = 0
  analiticaIndicadores: any = []
  todosLosTurnoMermas: any = []
  todosLosMermasAjustes: any = 0
  barraIndicadoresList: any = []
  todasLasMaquinass: any = []

  laSingl = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    },
    {
      "name": "UK",
      "value": 6200000
    }
  ]
  multiDD = [
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
  ];


  singleData = [
    {
      "name": "Ene",
      "series": [
        {
          "name": "2010",
          "value": 7300000
        },
        {
          "name": "2011",
          "value": 8940000
        }
      ]
    },

    {
      "name": "Feb",
      "series": [
        {
          "name": "2010",
          "value": 7870000
        },
        {
          "name": "2011",
          "value": 8270000
        }
      ]
    },

    {
      "name": "Mar",
      "series": [
        {
          "name": "2010",
          "value": 5000002
        },
        {
          "name": "2011",
          "value": 5800000
        }
      ]
    }, {
      "name": "Abr",
      "series": [
        {
          "name": "2010",
          "value": 7300000
        },
        {
          "name": "2011",
          "value": 8940000
        }
      ]
    },

    {
      "name": "ene",
      "series": [
        {
          "name": "2010",
          "value": 7870000
        },
        {
          "name": "2011",
          "value": 8270000
        }
      ]
    },

    {
      "name": "feb",
      "series": [
        {
          "name": "2010",
          "value": 5000002
        },
        {
          "name": "2011",
          "value": 5800000
        }
      ]
    }, {
      "name": "mar",
      "series": [
        {
          "name": "2010",
          "value": 7300000
        },
        {
          "name": "2011",
          "value": 8940000
        }
      ]
    },

    {
      "name": "abr",
      "series": [
        {
          "name": "2010",
          "value": 7870000
        },
        {
          "name": "2011",
          "value": 8270000
        }
      ]
    },

    {
      "name": "ener",
      "series": [
        {
          "name": "2010",
          "value": 5000002
        },
        {
          "name": "2011",
          "value": 5800000
        }
      ]
    }, {
      "name": "oct",
      "series": [
        {
          "name": "2010",
          "value": 7300000
        },
        {
          "name": "2011",
          "value": 8940000
        }
      ]
    },

    {
      "name": "nov",
      "series": [
        {
          "name": "2010",
          "value": 7870000
        },
        {
          "name": "2011",
          "value": 8270000
        }
      ]
    },

    {
      "name": "dic",
      "series": [
        {
          "name": "2010",
          "value": 5000002
        },
        {
          "name": "2011",
          "value": 5800000
        }
      ]
    }
  ];
  loading = false;
  machSelected = ""
  machSelect = false
  procSelect = false
  otraFecha = []
  alMachines = []
  alMachinesResp = []
  alInterruptions = []
  selectedMachine = ""
  plantSelected = ""
  selectedVista = "progreso"
  procSelected = ""
  selectedTime = ""
  subproducts = []
  allProcesos = []
  allProcesosResp = []
  allPlantas = []
  allPlantasResp = []
  spSelected = "";
  busco = false
  calidadValueDial = 0
  disponibilidadValueDial = 0
  rendimientoValueDial = 0
  oeeValueDial = 0
  chl = []
  allReporteData: any = {}

  dialActivo = ''
  categoriasDeParadas = [
    {
      name: "Mantencion",
      value: 0
    }, {
      name: "Falla maquina",
      value: 0
    }, {
      name: "Falta suministro",
      value: 0
    }, {
      name: "Falta servicio",
      value: 0
    }, {
      name: "Otros",
      value: 0
    }, {
      name: "Cambio turno",
      value: 0
    },
  ]


  paradasLista = [
    {
      name: "corte de luz",
      value: 0
    }, {
      name: "falta de agua",
      value: 0
    }, {
      name: "colacion",
      value: 0
    }, {
      name: "maquina sin manguera",
      value: 0
    }, {
      name: "maquina deteriorada",
      value: 0
    }, {
      name: "falta de mantencion",
      value: 0
    }, {
      name: "programadas",
      value: 0
    },
  ]

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
      data: [50, 30, 20]
    }]
  });

  nombre(nm) {
    return () => {
      return nm
    }
  }

  selectVista(vista) {
    this.selectedVista = vista
  }

  aleatorizarValores() {
    this.calidadValueDial = Math.floor(Math.random() * 100) + 0
    this.disponibilidadValueDial = Math.floor(Math.random() * 100) + 0
    this.rendimientoValueDial = Math.floor(Math.random() * 100) + 0
    /*this.oeeValueDial = Math.floor(Math.random() * 100) + 0*/
    this.oeeValueDial = (this.calidadValueDial + this.rendimientoValueDial + this.disponibilidadValueDial) / 3

    let nList = []

    for (let c of this.categoriasDeParadas) {
      c.value = Math.floor(Math.random() * 200) + 0
      nList.push(c)
    }
    this.categoriasDeParadas = nList
    nList = []
    for (let c of this.paradasLista) {
      c.value = Math.floor(Math.random() * 200) + 0
      nList.push(c)
    }
    this.paradasLista = nList


  }


  constructor(
    private machineService: MachineService,
    private plantService: PlantService,
    private subproductSevice: SubproductService,
    private processService: ProcessService,
    private interruptionService: InterruptionService,
    private reportesService: ReportesService,
    private dialog: MatDialog,
    private otService: OrdenDeTrabajoService,
    private oeeService: OeeService,
    private ordenDeTrabajoMermaService: OrdenDeTrabajoMermaService,
  ) {
  }

  ngOnInit(): void {
    moment.locale("es")





    this.busco = false
    this.machineService.getAll().subscribe(okMachines => {
      this.todasLasMaquinass = okMachines


      this.aplicarFiltro(JSON.stringify({selectedFechas: [Date.now(), moment(Date.now()).add(1, "d").toDate().getTime()]}))
      /*this.otService.getAll(null).subscribe(okOts => {
        let maquinasDeOt = Array.from(new Set(okOts.map(ot => ot.maq.id)))
        this.totalDeLaProduccionOTS = okOts.map(okOt => okOt.cantidadactual).reduce((a, b) => a + b, 0).toFixed(0)
        this.ordenesDeTrabajoList = okOts
        this.ordenesDeTrabajoListPorMaquina = []
        for (let maqui of maquinasDeOt) {
          let objMaqui: any = {}
          objMaqui.maq = this.ordenesDeTrabajoList.filter(ot => ot.maq.id == maqui)[0].maq
          objMaqui.cantidadactual = this.ordenesDeTrabajoList.filter(ot => ot.maq.id == maqui).map(o => o.cantidadactual).reduce((a, b) => a + b, 0)
          objMaqui.cantidadesperada = this.ordenesDeTrabajoList.filter(ot => ot.maq.id == maqui).map(o => o.cantidadesperada).reduce((a, b) => a + b, 0)
          this.ordenesDeTrabajoListPorMaquina.push(objMaqui)
        }
        console.log(this.ordenesDeTrabajoListPorMaquina);

        this.ordenDeTrabajoMermaService.getAll().subscribe(okOts => {
          this.mermasOrdenesDeTrabajoMermas = okOts
        })
        this.oeeService.analiticaOtMermas(null).subscribe(okMermasData => {
          this.mermaDataList = okMermasData
          console.log(okMermasData);
          this.mermasTotales = this.mermaDataList.mermasPorMaquina.map(m => m.totalMermas).reduce((a, b) => a + b, 0)
          this.totalProdMasMermas = +this.mermasTotales + +this.totalDeLaProduccionOTS
          console.log(this.mermasTotales);
          console.log(this.totalProdMasMermas);
          this.scrapProgreso = ((this.mermasTotales * 100) / this.totalProdMasMermas)
          console.log(this.scrapProgreso);
          let totalEsperado = okOts.map(okOt => okOt.cantidadesperada).reduce((a, b) => a + b, 0)
          let cantidadActualOts = okOts.map(okOt => okOt.cantidadactual).reduce((a, b) => a + b, 0)
          this.produccionProgreso = ((cantidadActualOts * 100) / totalEsperado).toFixed(0)
          console.log(this.produccionProgreso);
          this.mermaDonaPorMaquina = this.mermaDataList.mermasPorMaquina.map(m => {
            return {
              name: m.maquina.nombre,
              colorRecord: m.color,
              color: m.color,
              percentVsEstimada: 1,
              value: m.totalMermas
            }
          })
          this.mermaDonaPorTipo = this.mermaDataList.mermasPorTipo.map(m => {
            return {
              name: m?.merma?.nombre || 'Sin tipo',
              colorRecord: m.color,
              color: m.color,
              percentVsEstimada: 1,
              value: m.totalMermas
            }
          })

          this.mermaDonaPorTipoColor = {domain: this.mermaDonaPorTipo.map(o => o.color)}
          this.mermaDonaPorMaquinaColor = {domain: this.mermaDonaPorMaquina.map(o => o.color)}


          this.mermasBarraTipoList = this.mermaDataList.mermasPorTipo.map(m => {
            return {
              name: m?.merma?.nombre || 'Sin tipo',
              series: [{
                name: m?.merma?.nombre || 'Sin tipo',
                value: m.totalMermas
              }]
            }
          })
          this.mermasBarraColores = {domain: this.mermaDataList.mermasPorTipo.map(m => [m.color])}
          this.mermasBarraScrapYProducido = this.mermaDataList.mermasPorTipo.map(m => {
            return {
              name: m.merma?.nombre || 'Sin tipo',
              series: [{
                name: "Scrap",
                value: m.totalMermas
              }, {
                name: "Producido",
                value: m.ot.map(o => o.cantidadactual).reduce((a, b) => a + b, 0)
              }]
            }
          })
          this.mermasBarraColoresSYP = {
            domain: this.mermasBarraColores.domain.map(m =>
              [m[0], '#047900']
            ).flat()
          }
          console.log(this.mermasBarraColoresSYP);
          this.stockPorMaquinas = this.mermaDataList.mermasPorMaquina.map(m => {
            return {
              name: m.maquina.nombre,
              series: [{
                name: m.maquina.nombre,
                value: m.ot.map(o => o.cantidadactual).reduce((a, b) => a + b, 0)
              }]
            }
          })
          this.stockDonaPorMaquina = this.mermaDataList.mermasPorMaquina.map(m => {
            return {
              name: m.maquina.nombre,
              colorRecord: m.color,
              color: m.color,
              percentVsEstimada: 1,
              value: m.ot.map(o => o.cantidadactual).reduce((a, b) => a + b, 0)
            }
          })
          this.stockTotal = this.mermaDataList.mermasPorMaquina.map(m => m.ot.map(o => o.cantidadactual).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)


        })
      })
*/
      /*  this.oeeService.analiticaIndicadores().subscribe(okInd => {
          let maquin = Array.from(new Set(okInd.map(o => o.maquina)))
          for (let m of maquin) {
            let obj: any = {}
            obj.m = m
            obj.indicadores = okInd.filter(o => o.maquina == m)
            this.analiticaIndicadores.push(obj)
          }
          let listaMaquinaInd = []
          for (let kk of this.analiticaIndicadores) {
            let dataObj: any = {
              m: kk.m,
              maq: this.todasLasMaquinass.find(o => o.id == kk.m),
              indicators: {}
            }
            // this.machineService.getById(kk.m).subscribe(okMaq => {
            // dataObj.maq = okMaq

            for (let ind of kk.indicadores) {
              dataObj.indicators[ind.indicador] = {}
              dataObj.indicators[ind.indicador] = ind
            }
            listaMaquinaInd.push(dataObj)
            //})
          }
          this.analiticaIndicadores = listaMaquinaInd
          this.barraIndicadoresList = this.analiticaIndicadores.map(o => {

            return {
              name: o.maq.nombre,
              series: [{
                name: "OLE",
                value: o.indicators?.OLE?.valor
              }, {
                name: "OLE LOSS",
                value: 100 - o.indicators?.OLE?.valor
              }]
            }
          })
        })*/
      /*  this.oeeService.analiticaOtPendings(null).subscribe((okOtPendings: any) => {

          this.resumenOtPendings = okOtPendings.atrasadas
          this.resumenOtPendingsDona = okOtPendings.donaChart
          this.totalDelasOTPendingsYNo = +okOtPendings.atrasadas.length + +okOtPendings.normals.length
          this.resumenOtPendingsMaquinas = okOtPendings.maquinass

        })
        this.oeeService.analiticaMantsPendings(null).subscribe((okMantPendings: any) => {

          this.resumenMantPendings = okMantPendings.atraasadas
          this.resumenMantPendingsDona = okMantPendings.donaChart
          this.resumenMantPendingsDonaColors = {domain: okMantPendings.donaChart.map(o => o.color)}
          this.totalDelasMantPendingsYNo = okMantPendings.totalMants
          this.resumenMantPendingsMaquinas = okMantPendings.maquinass

        })*/


      this.reportesService.getAll().subscribe((okDataRepor: any) => {
        if (okDataRepor) {
          this.allReporteData = okDataRepor
          this.paretoInit(okDataRepor.disponibilidad.paradasInfo.map(o => o.name), okDataRepor.disponibilidad.paradasInfo.map(o => o.percent))
        }
        this.loading = false
        this.busco = true
      })
      this.machineService.getAll().subscribe(okMachines => {
        this.alMachines = okMachines
        this.alMachinesResp = okMachines
        this.aleatorizarValores()
      })
      this.subproductSevice.getAll().subscribe(okSp => {
        this.subproducts = okSp
      })
      this.processService.getAll().subscribe(okProcess => {
        this.allProcesos = okProcess
        this.allProcesosResp = okProcess
      })
      this.plantService.getAll().subscribe(okPlants => {
        this.allPlantas = okPlants
        this.allPlantasResp = okPlants
      })
      this.activar('oee')
    })
  }

  htmltoPDF() {
    // parentdiv is the html element which has to be converted to PDF
    html2canvas(document.querySelector("html")).then(canvas => {

      var pdf = new jsPDF.jsPDF('p', 'pt', [canvas.width, canvas.height]);

      var imgData = canvas.toDataURL("image/jpeg", 1.0);
      pdf.addImage(imgData, 0, 0, canvas.width, canvas.height);
      pdf.save('converteddoc.pdf');

    });

  }

  descargarData() {
    this.csvOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: false,
      headers: [],
      showTitle: true,
      useBom: false,
      removeNewLines: true,
      keys: ['nombre', 'maq', 'horainicio', 'cantidadactual', 'cantidadesperada']
    };
    this.csvData = this.ordenesDeTrabajoList;
    this.csvData.maq = JSON.stringify(this.csvData.maq)
    console.log(this.csvData);
    setTimeout(() => {
      this.csvComponent.onDownload();
    }, 500);
  }

  activar(dial) {
    this.dialActivo = dial
  }

  aplicarFiltro(filtro) {
    this.loading = true
    this.comienzaBusqueda = true
    filtro = JSON.parse(filtro)
    console.log("aplicando filtros desde reportes");
    console.log(filtro);
    console.log(this.ordenesDeTrabajoListPorMaquina);
    let filtroQuery = Object.keys(filtro).map(o => {
      return {name: o, value: filtro[o]}
    }).filter(o => o.value != null).map(o => `${o.name}=${o.value}`).join("&")
    console.log("?" + filtroQuery)
    this.otService.getAll("?" + filtroQuery).subscribe((okOts: any) => {
      this.todosLosTurnoMermas = okOts.map(o => o.turnomermas).flat()
      this.todosLosMermasAjustes = this.todosLosTurnoMermas.filter(o=>o.idmerma_merma?.nombre == "Ajustes").map(o=>o.cantidad).reduce((a,b)=>+a + +b,0)
      this.todosLosTurnoMermas.forEach(o =>
        o.otData = okOts.find(oo => oo.id == o.idordendetrabajo))
      console.log(this.todosLosTurnoMermas);

      let maquinasDeOt = Array.from(new Set(okOts.map(ot => ot.maq.id)))
      this.ordenesDeTrabajoList = okOts
      this.ordenesDeTrabajoListPorMaquina = []
      for (let maqui of maquinasDeOt) {
        let objMaqui: any = {}
        objMaqui.maq = this.ordenesDeTrabajoList.filter(ot => ot.maq.id == maqui)[0].maq
        objMaqui.maqiNombre = this.ordenesDeTrabajoList.filter(ot => ot.maq.id == maqui)[0].maq.nombre
        objMaqui.cantidadactual = this.ordenesDeTrabajoList.filter(ot => ot.maq.id == maqui).map(o => o.cantidadactual).reduce((a, b) => a + b, 0)
        objMaqui.cantidadesperada = this.ordenesDeTrabajoList.filter(ot => ot.maq.id == maqui).map(o => o.cantidadesperada).reduce((a, b) => a + b, 0)
        objMaqui.faltante = objMaqui.cantidadesperada - objMaqui.cantidadactual

        this.ordenesDeTrabajoListPorMaquina.push(objMaqui)

      }
      this.rowData = this.ordenesDeTrabajoListPorMaquina
      this.totalDeLaProduccionOTS = okOts.map(okOt => okOt.cantidadactual).reduce((a, b) => a + b, 0).toFixed(0)
      this.totalDeResiduos = okOts.map(o => o.residuos).reduce((a, b) => +a + +b, 0)

      this.ordenDeTrabajoMermaService.getAll().subscribe(okOts => {
        this.mermasOrdenesDeTrabajoMermas = okOts
      })
      this.oeeService.analiticaOtMermas("?" + filtroQuery).subscribe(okMermasData => {
        this.mermaDataList = okMermasData
        console.log(okMermasData);
        this.mermasTotales = this.mermaDataList.mermasPorMaquina.map(m => m.totalMermas).reduce((a, b) => a + b, 0)
        this.totalProdMasMermas = +this.mermasTotales + +this.totalDeLaProduccionOTS
        console.log(this.mermasTotales);
        console.log(this.totalProdMasMermas);
        this.scrapProgreso = ((this.mermasTotales * 100) / this.totalProdMasMermas)
        console.log(this.scrapProgreso);
        let totalEsperado = okOts.map(okOt => okOt.cantidadesperada).reduce((a, b) => a + b, 0)
        let cantidadActualOts = okOts.map(okOt => okOt.cantidadactual).reduce((a, b) => a + b, 0)
        this.produccionProgreso = ((cantidadActualOts * 100) / totalEsperado).toFixed(0)
        console.log(this.produccionProgreso);
        this.mermaDonaPorMaquina = this.mermaDataList.mermasPorMaquina.map(m => {
          return {
            name: m.maquina.nombre,
            colorRecord: m.color,
            color: m.color,
            percentVsEstimada: 1,
            value: m.totalMermas
          }
        })
        this.mermaDonaPorTipo = this.mermaDataList.mermasPorTipo.map(m => {
          return {
            name: m?.merma?.nombre || 'Sin tipo',
            colorRecord: m.color,
            color: m.color,
            percentVsEstimada: 1,
            value: m.totalMermas
          }
        })

        this.mermaDonaPorTipoColor = {domain: this.mermaDonaPorTipo.map(o => o.color)}
        this.mermaDonaPorMaquinaColor = {domain: this.mermaDonaPorMaquina.map(o => o.color)}


        this.mermasBarraTipoList = this.mermaDataList.mermasPorTipo.map(m => {
          return {
            name: m?.merma?.nombre || 'Sin tipo',
            series: [{
              name: m?.merma?.nombre || 'Sin tipo',
              value: m.totalMermas
            }]
          }
        })
        this.mermasBarraColores = {domain: this.mermaDataList.mermasPorTipo.map(m => [m.color])}
        /*    this.mermasBarraScrapYProducido = this.mermaDataList.mermasPorTipo.map(m => {
              return {
                name: m.merma?.nombre || 'Sin tipo',
                series: [{
                  name: "Scrap",
                  value: m.totalMermas
                }, {
                  name: "Producido",
                  value: m.ot.map(o => o.cantidadactual).reduce((a, b) => a + b, 0)
                }]
              }
            })*/

        this.mermasBarraScrapYProducido = okOts.map(m => {
          return {
            name: moment(m.horainicio).format("ddd DD/MM"),
            series: [{
              name: "Scrap",
              value: m.turnomermas.map(o => o.cantidad).reduce((a, b) => +a + +b, 0)
            }, {
              name: "Producido",
              value: m.cantidadactual
            }]
          }
        })


        this.mermasBarraColoresSYP = {
          domain: this.mermasBarraColores.domain.map(m =>
            [m[0], '#047900']
          ).flat()
        }
        console.log(this.mermasBarraColoresSYP);
        this.stockPorMaquinas = this.mermaDataList.mermasPorMaquina.map(m => {
          return {
            name: m.maquina.nombre,
            series: [{
              name: m.maquina.nombre,
              value: m.ot.map(o => o.cantidadactual).reduce((a, b) => a + b, 0)
            }]
          }
        })
        this.stockDonaPorMaquina = this.mermaDataList.mermasPorMaquina.map(m => {
          return {
            name: m.maquina.nombre,
            colorRecord: m.color,
            color: m.color,
            percentVsEstimada: 1,
            value: m.ot.map(o => o.cantidadactual).reduce((a, b) => a + b, 0)
          }
        })
        this.stockTotal = this.mermaDataList.mermasPorMaquina.map(m => m.ot.map(o => o.cantidadactual).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
        this.loading = false


      })


    })
    this.oeeService.analiticaOtPendings("?" + filtroQuery).subscribe((okOtPendings: any) => {

      this.resumenOtPendings = okOtPendings.atrasadas
      this.resumenOtPendingsDona = okOtPendings.donaChart
      this.totalDelasOTPendingsYNo = +okOtPendings.atrasadas.length + +okOtPendings.normals.length
      this.resumenOtPendingsMaquinas = okOtPendings.maquinass

    })
    this.oeeService.analiticaMantsPendings("?" + filtroQuery).subscribe((okMantPendings: any) => {

      this.resumenMantPendings = okMantPendings.atraasadas
      this.resumenMantPendingsDona = okMantPendings.donaChart
      this.resumenMantPendingsDonaColors = {domain: okMantPendings.donaChart.map(o => o.color)}
      this.totalDelasMantPendingsYNo = okMantPendings.totalMants
      this.resumenMantPendingsMaquinas = okMantPendings.maquinass
    })


  }

  selecPlanta() {
    console.log(this.plantSelected);
    console.log(this.allProcesos.filter(o => o.idplanta == this.plantSelected))
    this.allProcesos = this.allProcesosResp.filter(o => o.idplanta == this.plantSelected)

  }

  selecProcess() {
    console.log(this.procSelected);
    this.alMachines = this.alMachinesResp.filter(o => o.idproceso == this.procSelected)

  }

  planillasMenu() {
    this.dialog.open(BasicMenuComponent, {
      data: {
        menus: [
          {
            nombre: 'Planilla de producción',
            cmp: ReportesPlanillaProductosComponent
          }
        ]
      }
    })
  }

  cambiarChar() {
    this.chl = [
      'Overpriced',
      'Small portions',
      'Wait time',
      'Food is tasteless',
      'No atmosphere',
      'Not clean',
      'Too noisy',
      'Unfriendly staff'
    ]


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

  buscar() {
    this.busco = false
    this.errorMessage = ""
    this.loading = true

    if (this.machSelected) {
      this.reportesService.getByMaq(this.machSelected, this.selectedTime, this.selectedTime == "other" ? this.otraFecha.map(o => new Date(o).getTime()).join(':') : null, this.spSelected ? this.spSelected : null).subscribe(ok => {
        console.log(ok);
        if (ok.error) {
          this.errorMessage = ok.error
        } else {
          this.allReporteData = ok
          if (ok.disponibilidad?.paradasInfo) {
            this.paretoInit(ok.disponibilidad.paradasInfo.map(o => o.name), ok.disponibilidad.paradasInfo.map(o => o.percent))
          }
          this.busco = true
        }
        this.loading = false

      })
    } else if (this.procSelected) {
      this.reportesService.getByProc(this.procSelected, this.selectedTime, this.selectedTime == "other" ? this.otraFecha.map(o => new Date(o).getTime()).join(':') : null).subscribe(ok => {
        console.log(ok);
        if (ok.error) {
          this.errorMessage = ok.error
        } else {
          this.allReporteData = ok
          this.paretoInit(ok.disponibilidad.paradasInfo.map(o => o.name), ok.disponibilidad.paradasInfo.map(o => o.percent))
          this.busco = true
        }
        this.loading = false
      })
    } else if (this.plantSelected) {
      this.reportesService.getByPlant(this.procSelected, this.selectedTime, this.selectedTime == "other" ? this.otraFecha.map(o => new Date(o).getTime()).join(':') : null).subscribe(ok => {
        console.log(ok);
        if (ok.error) {
          this.errorMessage = ok.error
        } else {
          this.allReporteData = ok
          this.paretoInit(ok.disponibilidad.paradasInfo.map(o => o.name), ok.disponibilidad.paradasInfo.map(o => o.percent))
          this.busco = true
        }
        this.loading = false
      })
    } else {
      this.reportesService.getAll().subscribe((okDataRepor: any) => {
        this.allReporteData = okDataRepor
        this.paretoInit(okDataRepor.disponibilidad.paradasInfo.map(o => o.name), okDataRepor.disponibilidad.paradasInfo.map(o => o.percent))
        this.loading = false
        this.busco = true
      })
    }


  }


  imprimir() {
    printDiv('allData')
  }

  skrfoto(id) {
    var nodee = document.getElementById(id);

    var imgt;
    var filenamet;
    var newImaget;

    return new Promise((resolve, reject) => {
      domtoimage.toPng(nodee, {bgcolor: '#fff'})

        .then((dataUrl) => {

          imgt = new Image();
          imgt.src = dataUrl;
          newImaget = imgt.src;

          imgt.onload = () => {
            resolve(newImaget)
          };
        })
    })

  }

  downloadPDF() {

    /*
        var filename;
        let doc = new jsPDF.jsPDF()
        //let indicadoresImg:any = await this.skrfoto("indicadores")
        //let oeeImg:any = await this.skrfoto("oee")
        let calidadImg: any = await this.skrfoto("rendimiento")
        doc.addImage(calidadImg, 'PNG', 10, 10, 1300, 400);
        // doc.addPage()
        //doc.addImage(calidadImg, 'PNG', 10, 450, 1300, 800);
        //doc.addImage(calidadImg, 'PNG', 10, 450, 1300, 500);
        filename = 'MES-reporte-' + moment().format("yyyyMMDDHHmm") + '.pdf';
        doc.save(filename);
    */

    this.dialActivo = 'foto'

    var img
    var newImage
    var filename
    var node = document.getElementById('allData');
    node.style.display = 'block'

    setTimeout(() => {
      domtoimage.toPng(node, {bgcolor: '#fff'})


        .then((dataUrl) => {

          img = new Image();
          img.src = dataUrl;
          newImage = img.src;

          img.onload = async () => {

            var pdfWidth = img.width;
            var pdfHeight = img.height;

            // FileSaver.saveAs(dataUrl, 'my-pdfimage.png'); // Save as Image

            var doc;

            if (pdfWidth > pdfHeight) {
              doc = new jsPDF.jsPDF('l', 'px', [pdfWidth, pdfHeight]);
            } else {
              doc = new jsPDF.jsPDF('p', 'px', [pdfWidth, pdfHeight]);
            }


            var width = doc.internal.pageSize.getWidth();
            var height = doc.internal.pageSize.getHeight();

            doc.addImage(newImage, 'PNG', 10, 10, width, height);
            //doc.addImage(calidadImg, 'PNG', 10, 450, 1300, 500);
            filename = 'MES-Monitoreo-' + moment().format("yyyyMMDDHHmm") + '.pdf';
            doc.save(filename);
            this.dialActivo = 'oee'


          };
        })
        .catch(function (error) {

          // Error Handling

        });
    }, 1000)


  }

  onSelect(evnt) {
    evnt.console.log()
  }


}
