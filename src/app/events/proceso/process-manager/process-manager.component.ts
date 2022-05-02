import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProcessService} from "@app/_services/process.service";
import {PlantService} from "@app/_services/plant.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {PlantManagerComponent} from "@app/events/planta/plant-manager/plant-manager.component";
import Swal from "sweetalert2";
import {Alerts} from "@app/_helpers/alerts";

@Component({
  selector: 'app-process-manager',
  templateUrl: './process-manager.component.html',
  styleUrls: ['./process-manager.component.sass']
})
export class ProcessManagerComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  error = '';
  editing = false;
  plantList = []
  isLoading = false;
  showingPlant = false;
  entityName = "proceso"
  @Output() hide = new EventEmitter<string>();


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any = false,
    private formBuilder: FormBuilder,
    private service: ProcessService,
    private service2: PlantService,
    private dialog: MatDialog,
    private alerts: Alerts
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.formBuilder.group({

      id: [""],
      nombre: ["", Validators.required],
      descripcion: [""],
      idplanta: ["", Validators.required],
    })
    this.service.dataManager.subscribe(ok => {
      this.limpiar()

      if (ok) {
        this.editing = true;
        for (let u of Object.keys(ok)) {
          if (this.dataForm.controls[u]) {
            this.dataForm.controls[u].setValue(ok[u])
          }
        }
      }
    })

    this.loadService2()


  }


  showPlant() {
    this.dialog.open(PlantManagerComponent, {
      data: {
        inModal: true
      }
    })
  }

  loadService2() {
    this.service2.dataTable.subscribe(objects2 => {
      if (objects2) {
        this.plantList = objects2
        console.log(this.plantList);
        this.f.idplanta.setValue(objects2.length >= 1 ? objects2[0].id : '')
      }

    })
    this.service2.refreshDataTable().then(ok => {
      console.log(ok);
    })

  }

  get f() {
    return this.dataForm.controls;
  }

  limpiar() {
    this.editing = false
    this.dataForm.reset()
    this.loadService2()
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
            descripcion: this.f.descripcion.value,
            idplanta: this.f.idplanta.value,
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
        descripcion: this.f.descripcion.value,
        idplanta: this.f.idplanta.value,
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

}
