import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "@app/_services/product.service";
import {InventoryService} from "@app/_services/inventory.service";
import {PlantService} from "@app/_services/plant.service";
import Swal from "sweetalert2";
import {Alerts} from "@app/_helpers/alerts";

@Component({
  selector: 'app-inventory-manager',
  templateUrl: './inventory-manager.component.html',
  styleUrls: ['./inventory-manager.component.sass']
})
export class InventoryManagerComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  error = '';
  editing = false;manager
  isLoading = false;
  entityName = "inventario"
  @Output() hide = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder,
    private service: InventoryService,
    private alerts:Alerts
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.formBuilder.group({
      id: [""],
      nombre: ["",Validators.required],
      sku: [""],
      categoria: [""],
      stock: [""],
    })
    this.service.dataManager.subscribe(ok => {
      this.limpiar()
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
            sku: this.f.sku.value,
            categoria: this.f.categoria.value,
            stock: this.f.stock.value,
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
        sku: this.f.sku.value,
        categoria: this.f.categoria.value,
        stock: this.f.stock.value,
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
