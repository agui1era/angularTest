import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ProductService} from "@app/_services/product.service";
import * as moment from "moment";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryDetentionService} from "@app/_services/categoryDetention.service";
import Swal from "sweetalert2";
import {Alerts} from "@app/_helpers/alerts";
import {InterruptionService} from "@app/_services/interruption.service";
import {MachineService} from "@app/_services/machine.service";
import {DetentionService} from "@app/_services/detention.service";
import {MatDialog} from "@angular/material/dialog";
import {InventoryMaintenanceManagerComponent} from "@app/inventory-maintenance-manager/inventory-maintenance-manager.component";
import {environment} from "@environments/environment";

@Component({
  selector: 'app-category-detention-data-manager',
  templateUrl: './category-detention-data-manager.component.html',
  styleUrls: ['./category-detention-data-manager.component.sass']
})
export class CategoryDetentionDataManagerComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  error = '';
  editing = false;
  isLoading = false;
  entityName = "categoria de parada"
  displayedColumns = ["nombre", "editar", "delete", "inv"]
  @Output() hide = new EventEmitter<string>();

  allDetentionsList = []
  allDetentionsOfCat = []
  readOnly = false

  constructor(
    private formBuilder: FormBuilder,
    private service: CategoryDetentionService,
    private machineService: MachineService,
    private alerts: Alerts,
    private detentionService: DetentionService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {


    this.dataForm = this.formBuilder.group({
      id: [""],
      nombre: ["", Validators.required],
      tipo: ["programada"],
      clase: ["MPL"],
      color: ["#ffffff", Validators.required],
      requiereInventario: [false],
      alertacritica: [false],
    })
    this.service.dataManager.subscribe(ok => {
      this.limpiar()

      if (ok) {
        this.editing = true;
        console.log(ok?.nombre);
        if(ok?.nombre == 'Mantenimiento' ||
          ok?.nombre == 'Falla maquina' ||
          ok?.nombre == 'Situaciones externas' ||
          ok?.nombre == 'Falta Servicio' ||
          ok?.nombre == 'Paros Programados'
        ){
          this.f.nombre.disable()
        }
        for (let u of Object.keys(ok)) {
          if (this.dataForm.controls[u]) {
            this.dataForm.controls[u].setValue(ok[u])
          }
        }
        this.loadDetentions()
      }
    })


  }

  get f() {
    return this.dataForm.controls;
  }

  limpiar() {
    this.editing = false
    this.dataForm.reset()
    this.f.tipo.setValue("programada")
    this.f.color.setValue("#ffffff")
    this.f.requiereInventario.setValue(false)
    this.f.alertacritica.setValue(false)
  }

  viewInventory(detention) {
    console.log(detention);
    this.dialog.open(InventoryMaintenanceManagerComponent, {
      data: {
        create: true,
        detention
      }
    })


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
            tipo: this.f.tipo.value,
            clase: this.f.clase.value,
            color: this.f.color.value,
            alertacritica: this.f.alertacritica.value,
            requiereInventario: this.f.requiereInventario.value,
          }
          this.service.update(data).subscribe(ok => {
            setTimeout(() => {
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
        tipo: this.f.tipo.value,
        clase: this.f.clase.value,
        color: this.f.color.value,
        requiereInventario: this.f.requiereInventario.value,
        alertacritica: this.f.alertacritica.value
      }
      console.log(data);
      this.service.create(data).subscribe(ok => {
        this.service.refreshDataTable().then(okk => {
          console.log(okk);
          console.log(ok);
          this.isLoading = false
          this.hide.emit("ocultar");

        })
      }, error => {
        console.log(error.error);
        this.alerts.errorAlert(error)

        this.isLoading = false

      })
    }

  }

  loadDetentions() {
    return new Promise((o, n) => {
      this.machineService.getAllDetentions().subscribe(allDetentions => {
        console.log(allDetentions);
        this.allDetentionsList = allDetentions.filter(o => o.idcategoriaparada == this.f.id.value && o.idmaqrel == null)
        o(allDetentions)

      }, error => {
        n(error)

      })

    })
  }

  editDetention(obj) {
    this.alerts.editAlert("Parada").then(resu => {
      if (resu.isConfirmed) {
        let req = {
          id: obj.id,
          nombre: obj.nombre
        }
        this.detentionService.update(req).subscribe(ok => {
          console.log(ok);
          obj.isEdit = false
        })
      }
    })

  }

  createDetention() {

    console.log(this.f.id.value);
    this.detentionService.create({
      idcategoriaparada: this.f.id.value
    }).subscribe(ok => {
      console.log(ok);
      this.loadDetentions()
    })
  }

  deleteDetention(id) {
    this.detentionService.delete(id).subscribe(ok => {
      console.log(ok);
      this.loadDetentions()
    })
  }


}
