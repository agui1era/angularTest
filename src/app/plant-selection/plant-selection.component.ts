import {Component, OnInit} from '@angular/core';
import {PlantService} from "@app/_services/plant.service";
import {TurnService} from "@app/_services/turn.service";
import {OeeService} from "@app/_services/oee.service";

@Component({
  selector: 'app-plant-selection',
  templateUrl: './plant-selection.component.html',
  styleUrls: ['./plant-selection.component.sass']
})
export class PlantSelectionComponent implements OnInit {


  entitiesList = []

  constructor(
    private service: PlantService,
    private oeeService: OeeService,
    private turnService: TurnService) {
  }


  ngOnInit(): void {
    this.service.getAll().subscribe(ok => {
      this.entitiesList = ok
      console.log(ok);

      for (let p of this.entitiesList) {
        this.oeeService.oeeByPlant(p.id).subscribe((okOee: any) => {
          p.oee = okOee
          console.log(okOee);
          p.maquinas = okOee.procesos.map(o=>o.maquinas.length).reduce((a,b)=>a+b,0)
          p.operativas = okOee.procesos.map(o=>o.maquinas.filter(o=>o.estado == "operativa").length).reduce((a,b)=>a+b,0)
          p.mantenciones = okOee.procesos.map(o=>o.maquinas.filter(o=>o.estado == "mantenimiento").length).reduce((a,b)=>a+b,0)
          p.detenidas = okOee.procesos.map(o=>o.maquinas.filter(o=>o.estado == "detenida").length).reduce((a,b)=>a+b,0)


          /*  for(let proc of okOee.procesos){
              p.operativas = proc.maquinas.filter(o=>o.estado == "operativa").length
              p.mantenciones = proc.maquinas.filter(o=>o.estado == "mantenimiento").length
              p.detenidas = proc.maquinas.filter(o=>o.estado == "detenida").length

            }*/

          console.log(p);
        })
      }

    })


  }

}
