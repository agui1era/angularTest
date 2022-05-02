import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProcessService} from "@app/_services/process.service";
import {OeeService} from "@app/_services/oee.service";

@Component({
  selector: 'app-process-selection',
  templateUrl: './process-selection.component.html',
  styleUrls: ['./process-selection.component.sass']
})
export class ProcessSelectionComponent implements OnInit {
  parameters = "";
  entitiesList = []
  loading = true

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: ProcessService,
    private oeeService: OeeService
  ) {
  }


  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe((params: any) => {
      this.parameters = params.get('id');
    });
    this.service.getAll().subscribe(entities => {
      console.log(entities);
      for (let pro of entities) {
        this.oeeService.oeeByProcess(pro.id).subscribe((okOee:any) => {
          pro.oee = okOee
          console.log(okOee);
          pro.maquinas = okOee.maquinas.length
          pro.mantenciones = okOee.maquinas.filter(o=>o.estado == "mantenimiento").length
          pro.operativas = okOee.maquinas.filter(o=>o.estado == "operativa").length
          pro.detenidas= okOee.maquinas.filter(o=>o.estado == "detenida").length

        })
      }

      if (this.parameters == "todos") {
        this.entitiesList = entities
      } else {
        this.entitiesList = entities.filter(o => o.idplanta == this.parameters)
      }
      this.loading = false
    })


  }

}
