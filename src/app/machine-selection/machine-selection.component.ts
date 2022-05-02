import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProcessService} from "@app/_services/process.service";
import {MachineService} from "@app/_services/machine.service";
import {OeeService} from "@app/_services/oee.service";

@Component({
  selector: 'app-machine-selection',
  templateUrl: './machine-selection.component.html',
  styleUrls: ['./machine-selection.component.sass']
})
export class MachineSelectionComponent implements OnInit {
loading = true
  parameters = "";
  entitiesList = []

  constructor(
    private activatedRoute:ActivatedRoute,
    private service:MachineService,
    private oeeService:OeeService

  ) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe((params:any) => {
      this.parameters = params.get('id');
    });
    this.service.getAll().subscribe(entities=>{
      console.log(entities);
      for(let mch of entities){
        this.oeeService.oeeByMachine(mch.id).subscribe(okOee=>{
          mch.oee = okOee
        })
      }
      if(this.parameters == "todos"){
        this.entitiesList = entities
      }else{
        this.entitiesList = entities.filter(o=>o.idproceso== this.parameters)
      }
      this.loading = false

    })



  }

}
