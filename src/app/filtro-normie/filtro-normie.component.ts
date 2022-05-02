import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { MachineService } from '@app/_services/machine.service';
import {PlantService} from "@app/_services/plant.service";
import { ProcessService } from '@app/_services/process.service';
import * as moment from "moment";

@Component({
  selector: 'app-filtro-normie',
  templateUrl: './filtro-normie.component.html',
  styleUrls: ['./filtro-normie.component.sass']
})
export class FiltroNormieComponent implements OnInit {

  selectListMachines: any = []
  selectListPlants: any = []
  selectListProcesses: any = []
  selectListMachinesResp: any = []
  selectListPlantsResp: any = []
  selectListProcessesResp: any = []
  @Output() leFilter = new EventEmitter<string>();
  @Output() imprimir = new EventEmitter<string>();
  @Output() descargar = new EventEmitter<string>();

  desde: any = ""
  hasta: any = ""

  selectedMachine: any = null
  selectedProcess: any = null
  selectedPlant: any = null
  selectedFechas: any = null


  constructor(
    private plantService: PlantService,
    private processService: ProcessService,
    private machineService: MachineService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.desde = moment().format("YYYY-MM-DD")
    this.hasta = moment().add(1, "d").format("YYYY-MM-DD")
    this.selectListMachinesResp = await this.machineService.getAll().toPromise()
    this.selectListMachines = this.selectListMachinesResp
    this.selectListPlantsResp = await this.plantService.getAll().toPromise()
    this.selectListPlants = this.selectListPlantsResp
    this.selectListProcessesResp = await this.processService.getAll().toPromise()
    this.selectListProcesses = this.selectListProcessesResp

  }

  filtrar(){
    this.selectedFechas = []
    if(this.desde && this.hasta){
      this.selectedFechas.push(moment(this.desde).toDate().getTime())
      this.selectedFechas.push(moment(this.hasta).toDate().getTime())
    }else{
      this.selectedFechas = null
    }
    let filtross = {
      selectedMachine:this.selectedMachine,
      selectedPlant:this.selectedPlant,
      selectedProcess:this.selectedProcess,
      selectedFechas:this.selectedFechas,
    }
    console.log(filtross);
    this.leFilter.emit(JSON.stringify(filtross))
  }

  elegirPlanta(){
    this.selectedMachine = null
    this.selectedProcess = null
    if(this.selectedPlant){
      this.selectListProcesses = this.selectListProcessesResp.filter(o=>o.idplanta == this.selectedPlant)
    }
  }
  elegirProceso(){
    this.selectedMachine = null
    if(this.selectedProcess){
      this.selectListMachines = this.selectListMachinesResp.filter(o=>o.idproceso == this.selectedProcess)
    }
  }
  imprimirBtn(){
    this.imprimir.emit('')
  }

  descargarBtn(){
    this.descargar.emit('')
  }


}
