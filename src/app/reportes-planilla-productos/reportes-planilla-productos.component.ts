import {Component, OnInit} from '@angular/core';
import {PlanillasService} from "@app/_services/planillas.service";
import {Angular2CsvComponent} from "angular2-csv";
import * as moment from "moment";

@Component({
  selector: 'app-reportes-planilla-productos',
  templateUrl: './reportes-planilla-productos.component.html',
  styleUrls: ['./reportes-planilla-productos.component.sass']
})
export class ReportesPlanillaProductosComponent implements OnInit {
  inputFechaI = ""
  options:any = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: [],
    showTitle: true,
    useBom: false,
    removeNewLines: true,
    keys: ['nombre', 'sku', 'total']
  };
  data = [
    {
      name: "Test, 1",
      age: 13,
      average: 8.2,
      approved: true,
      description: "using 'Content here, content here' "
    }
  ];

  constructor(
    private planillasService: PlanillasService) {
  }

  ngOnInit(): void {
    //this.inputFechaI = moment().format("YYYY-MM-DD")+moment().format("THH:mm")
    this.inputFechaI = moment().format("YYYY-MM-DD")

    this.descargar()
  }

  descargar() {
    this.options.title =  moment(this.inputFechaI).format("YYYY-MM-DD")
    this.planillasService.getPlanillaProduccion(this.inputFechaI).subscribe(ok => {
      this.data = ok
      console.log(ok);
    })
  }

}
