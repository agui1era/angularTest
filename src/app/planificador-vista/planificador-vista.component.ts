import {Component, OnInit} from '@angular/core';
import {Item, Period, Section, Events, NgxTimeSchedulerService, Text} from 'ngx-time-scheduler-mes-software';

import * as moment from "moment";
import {PlanificadorService} from "@app/_services/planificador.service";
import {MachineService} from "@app/_services/machine.service";
import {MatDialog} from "@angular/material/dialog";
import {InfoEventTsComponent} from "@app/info-event-ts/info-event-ts.component";
import {PlanificadorParadaCreatorComponent} from "@app/planificador-parada-creator/planificador-parada-creator.component";

@Component({
  selector: 'app-planificador-vista',
  templateUrl: './planificador-vista.component.html',
  styleUrls: ['./planificador-vista.component.sass']
})
export class PlanificadorVistaComponent implements OnInit {
  events: Events = new Events();
  periods: Period[];
  sections: Section[];
  items: Item[];
  textoCalCustom: Text = new Text()
  todasLasMaquinas = []
  eventosMaquina = []
  vistaCalendario = true
  isLoaded = false
  loading = false

  constructor(
    private service: NgxTimeSchedulerService,
    private planifService: PlanificadorService,
    private machineService: MachineService,
    private dialog: MatDialog
  ) {
  }

  async ngOnInit(): Promise<void> {

    this.textoCalCustom.SectionTitle = "Mantenimiento"
    this.textoCalCustom.GotoButton = "Ir a"
    this.textoCalCustom.NextButton = "Siguiente"
    this.textoCalCustom.PrevButton = "Anterior"
    this.textoCalCustom.TodayButton = "Hoy"
    this.events.SectionClickEvent = (section) => {
      console.log(section);
    };
    this.events.ItemClicked = (item) => {
      this.dialog.open(InfoEventTsComponent, {
        data: {
          item
        }
      }).afterClosed().subscribe(ok => {
        this.cargarDatos().then(okk => okk)
      })

    };
    this.events.ItemDropped = (item) => {
      console.log(item);
    };

    this.periods = [
      /*  {
          name: 'Minuto',
          timeFramePeriod: (30),
          timeFrameOverall: (120),
          timeFrameHeaders: [
            'Do MMM',
            'HH:mm'
          ],
        classes: ''
    },*/{
        name: 'Hora',
        timeFramePeriod: (60),
        timeFrameOverall: (180 * 4),
        timeFrameHeaders: [
          'Do MMM',
          'HH:mm'
        ],
        classes: ''
      }, {
        name: 'Día',
        timeFrameHeaders: ['MMM YYYY', 'DD(ddd)'],
        classes: '',
        timeFrameOverall: 1440 * 7,
        timeFramePeriod: 1440,
      }, {
        name: 'Semana',
        timeFrameHeaders: ['MMM YYYY', 'DD'],
        classes: '',
        timeFrameOverall: 10080 * 4,
        timeFramePeriod: 10080,
      }, {
        name: 'Mes',
        timeFrameHeaders: ['MMM YYYY', 'DD'],
        classes: '',
        timeFrameOverall: 10080 * 4 * 12,
        timeFramePeriod: 10080,
      }];


    /*  this.sections = [{
        name: 'E4',
        id: -1
      },];
      this.items = [{
        id: 4,
        sectionID: 1,
        name: 'Item 1',
        start: moment().startOf('day'),
        end: moment().add(5, 'days').endOf('day'),
        classes: ''
      }, {
        id: 5,
        sectionID: 1,
        name: 'Item 2',
        start: moment().startOf('day'),
        end: moment().hours(5).minutes(30),
        classes: ''
      }];*/


    await this.cargarDatos()


    /*

    this.sections = [{
      name: 'E4',
      id: 1
    },];

    this.items = [{
      id: 4,
      sectionID: 1,
      name: 'Item 1',
      start: moment().startOf('day'),
      end: moment().add(5, 'days').endOf('day'),
      classes: ''
    }];
*/

  }

  abrirCrearParada(categoryID,listaDetenciones) {
    this.dialog.open(PlanificadorParadaCreatorComponent,
      {
        data:{
          categoryID,
          listaDetenciones
        }
      }
      ).afterClosed().subscribe(ok => {
      console.log(ok);
      this.cargarDatos()
    })
  }


  refrescaree() {

    this.service.refresh()
  }

  async cargarDatos() {
    this.loading = true
    this.eventosMaquina = ((await this.planifService.getAll().toPromise()) as any).results;
    //this.eventosMaquina = this.eventosMaquina.results
    console.log(this.eventosMaquina);
    this.todasLasMaquinas = await this.machineService.getAll().toPromise()


    console.log(this.service);

    if (this.eventosMaquina?.length > 0 && this.todasLasMaquinas?.length > 0) {

      console.log("cargando");
      console.log(this.todasLasMaquinas);

      this.sections = this.todasLasMaquinas.map(o => {
        return {
          //dataOt: o,
          name: o.nombre,
          id: o.id
        }
      })
      this.isLoaded = true
      console.log(this.sections);
      console.log(this.eventosMaquina);
      this.items = this.eventosMaquina.map(o => {

        let cc = 0
        cc += 1
        return {
          nameLabel: o.type == 'ot' ? 'OT' :
            o.type == 'mant' ? 'Mantención' :
              o.type == 'int' ? 'Interrupción' : '',
          idObj: o.idObj,
          id: cc,
          sectionID: parseInt(o.maq),
          name: o.name,
          start: moment(o.start),
          end: moment(o.end),
          classes: o.type
        }
      })
    }
    setTimeout(() => {
      this.refrescaree()
      this.loading = false

    }, 600)
  }

}
