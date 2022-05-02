import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PlantService} from "@app/_services/plant.service";
import {ProductService} from "@app/_services/product.service";
import Swal from "sweetalert2";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Alerts} from "@app/_helpers/alerts";

@Component({
  selector: 'app-plant-manager',
  templateUrl: './plant-manager.component.html',
  styleUrls: ['./plant-manager.component.sass']
})
export class PlantManagerComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  error = '';
  editing = false;
  isLoading = false;
  entityName = "planta"
  @Output() hide = new EventEmitter<string>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private service: PlantService,
    private alerts:Alerts
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.formBuilder.group({
      id: [""],
      nombre: ["", Validators.required],
    })
    this.service.dataManager.subscribe(ok => {
      if (ok) {
        this.editing = true;
        console.log(ok);
        for (let u of Object.keys(ok)) {
          if (this.dataForm.controls[u]) {
            this.dataForm.controls[u].setValue(ok[u])
          }
        }
      }
    })


  }

  get f() {
    return this.dataForm.controls;
  }

  limpiar() {
    this.editing = false
    this.dataForm.reset()
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
