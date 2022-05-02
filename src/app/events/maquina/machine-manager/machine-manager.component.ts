import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProcessService} from "@app/_services/process.service";
import {MachineService} from "@app/_services/machine.service";
import {ProductService} from "@app/_services/product.service";
import {InventoryService} from "@app/_services/inventory.service";
import {CategoryDetentionService} from "@app/_services/categoryDetention.service";
import {MatDialog} from "@angular/material/dialog";
import {ProcessManagerComponent} from "@app/events/proceso/process-manager/process-manager.component";
import Swal from "sweetalert2";
import {DetentionService} from "@app/_services/detention.service";
import {Alerts} from "@app/_helpers/alerts";
import {MachineDetentionsManagerComponent} from "@app/machine-detentions-manager/machine-detentions-manager.component";
import {MachineProductsManagerComponent} from "@app/machine-products-manager/machine-products-manager.component";
import {SubproductmachineService} from "@app/_services/subproductmachine.service";

@Component({
  selector: 'app-machine-manager',
  templateUrl: './machine-manager.component.html',
  styleUrls: ['./machine-manager.component.sass']
})
export class MachineManagerComponent implements OnInit {
  isLoading = false;
  dataForm: FormGroup;
  error = '';
  editing = false;
  processList = []
  inventoryList = []
  entityName = "maquina"
  @Output() hide = new EventEmitter<string>();
  subproductsMachineSelected = []
  machineSelected:any = "";
  constructor(
    private formBuilder: FormBuilder,
    private service: MachineService,
    private service2: ProcessService,
    private service4: InventoryService,
    private service6: DetentionService,
    private subproductmachineService: SubproductmachineService,
    private dialog: MatDialog,
    private alerts: Alerts
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.formBuilder.group({
      id: [""],
      nombre: ["", Validators.required],
      //velpromprod: [""],
      conSensor: ["",],
      oeeesperado: [""],
      lugar: [""],
      //estndrprod: [""],
      idproceso: ["",Validators.required],
      subproductoasignado: [""],
    })

    this.service.dataManager.subscribe(ok => {
      this.limpiar()
      if (ok) {
        this.editing = true;
        console.log(ok);
        this.machineSelected = ok.id
        for (let u of Object.keys(ok)) {
          if (this.dataForm.controls[u]) {
            this.dataForm.controls[u].setValue(ok[u])
          }
        }
        this.service.refreshProductsOfMachine(ok.id).then(ok => {
          console.log(ok);
        })
        this.service.refreshDetentionsOfMachine(ok.id).then(ok => {
          console.log(ok);
        })
        this.subproductmachineService.getAll(ok.id).subscribe(okspmlist=>{
          console.log(okspmlist);
          this.subproductsMachineSelected = okspmlist
        })
      }
    })
    this.subproductmachineService.dataTable.subscribe(okdtable=>{
      this.service.getById(this.machineSelected).subscribe(okMachineData=>{
        this.subproductmachineService.getAll(this.machineSelected).subscribe(okspmlist=>{
          console.log(okspmlist);
          this.subproductsMachineSelected = okspmlist
          this.f.subproductoasignado.setValue(okMachineData.subproductoasignado)
        })
      })
    })

    this.service2.dataTable.subscribe(objects2 => {
      if (objects2) {
        console.log(objects2);
        this.processList = objects2
      }
    })
    this.service2.refreshDataTable().then(ok => {
      console.log(ok);
    })


    this.service4.getAll().subscribe(objects4 => {
      this.inventoryList = objects4
    })
    /* this.service6.getAll().subscribe(objects6=> {
       this.inventoryList = objects6
     })*/

  }

  get f() {
    return this.dataForm.controls;
  }

  limpiar() {

    /* this.editing = false
     this.dataForm.reset()
     this.f.idproceso.setValue(this.processList.length >= 1 ? this.processList[0].id : '')
   */
  }

  onSubmit() {
    this.isLoading = true
    if (this.editing) {

      this.alerts.editAlert(this.entityName).then((result) => {
        if (result.isConfirmed) {
          console.log("editando");
          let data = {
            id: this.f.id.value,
            nombre: this.f.nombre.value,
          //  velpromprod: this.f.velpromprod.value,
            conSensor: this.f.conSensor.value,
            oeeesperado: this.f.oeeesperado.value,
            //estndrprod: this.f.estndrprod.value,
            lugar: this.f.lugar.value,
            subproductoasignado: this.f.subproductoasignado.value,
            idproceso: this.f.idproceso.value,
          }
          let productsSelected = this.service.machineProductsList.filter(o => o.id == undefined).map(o => o.value)
          let detentionsList = []
          let machineDetentionsList = this.service.machineDetentionsList
          detentionsList = machineDetentionsList.filter(o => o.id == undefined)
          console.log(detentionsList);

          this.service.update(data).subscribe(ok => {
            setTimeout(() => {

              this.service.createProductsOfMachine(productsSelected, this.f.id.value).subscribe(productsOK => {
                console.log(productsOK);
              })

              this.service.createDetentionsOfMachine(detentionsList, this.f.id.value).subscribe(detentionsOK => {
                console.log(detentionsOK);
              })

              this.service.refreshDataTable().then(okk => {
                console.log(okk);
                console.log(ok);
                this.isLoading = false
                this.hide.emit("ocultar");

              })
            }, 500)

          }, error => {
            console.log(error.error);
            this.alerts.errorAlert(error)
            this.isLoading = false

          })
        } else {
          this.isLoading = false
        }
      })
    } else {

      let data = {
        nombre: this.f.nombre.value,
       // velpromprod: this.f.velpromprod.value,
        oeeesperado: this.f.oeeesperado.value,
       // estndrprod: this.f.estndrprod.value,
        subproductoasignado: this.f.subproductoasignado.value,

        conSensor: this.f.conSensor.value,
        lugar: this.f.lugar.value,
        idproceso: this.f.idproceso.value,
      }
      console.log(data);

      let selectedProducts = this.service.machineProductsList.filter(o => o.value != 0).map(o => o.value)

      let machineDetentionsList = this.service.machineDetentionsList

      console.log(machineDetentionsList);

      this.service.create(data).subscribe(ok => {


      /*  this.service.createProductsOfMachine(selectedProducts, ok.id).subscribe(productsOK => {
          console.log(productsOK);
        })

        this.service.createDetentionsOfMachine(machineDetentionsList, ok.id).subscribe(detentionsOK => {
          console.log(detentionsOK);
        })
*/
        if(ok.error){
          console.log(ok.error);
          this.alerts.errorAlert(ok)
          this.isLoading = false
        }else{
          this.service.refreshDataTable().then(okk => {
            console.log(okk);
            console.log(ok);
            this.isLoading = false
            /*this.limpiar()*/
            this.hide.emit("ocultar");

          })
        }


      }, error => {
        console.log(error.error);
        this.alerts.errorAlert(error)
        this.isLoading = false

      })

    }
  }

  limitara100() {
    if (this.dataForm.controls.oeeesperado.value > 100) {
      this.dataForm.controls.oeeesperado.setValue(100)
    } else if (this.dataForm.controls.oeeesperado.value < 0) {
      this.dataForm.controls.oeeesperado.setValue(0)

    }
  }


  showProcess() {
    this.dialog.open(ProcessManagerComponent, {
      data: {
        inModal: true
      }
    })
  }

  abrirParadasMaquina() {
    this.dialog.open(MachineDetentionsManagerComponent, {
      width: "70vw",
      data: {
        inModal: true
      }
    })
  }

  abrirProductosMaquina() {
    this.dialog.open(MachineProductsManagerComponent, {
      width: "55vw",
      height: "70vh",
      data: {
        inModal: true
      }
    }).afterClosed().subscribe(okClose=>{
      this.service.getById(this.machineSelected).subscribe(okMachineData=>{
        this.subproductmachineService.getAll(this.machineSelected).subscribe(okspmlist=>{
          console.log(okspmlist);
          this.subproductsMachineSelected = okspmlist
          this.f.subproductoasignado.setValue(okMachineData.subproductoasignado)
        })
      })

    })
  }

}
