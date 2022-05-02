  import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "@app/_services/product.service";
import Swal from "sweetalert2";
import {Alerts} from "@app/_helpers/alerts";
import {SubproductService} from "@app/_services/subproduct.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-subproduct-manager',
  templateUrl: './subproduct-manager.component.html',
  styleUrls: ['./subproduct-manager.component.sass']
})
export class SubProductManagerComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  error = '';
  editing = false;
  isLoading = false;
  entityName = "producto"
  @Output() hide = new EventEmitter<string>();
  productsList = []

  constructor(
    private formBuilder: FormBuilder,
    private service: SubproductService,
    private productService: ProductService,
    private alerts: Alerts,
    private thisDialogRef: MatDialogRef<SubProductManagerComponent>,
  ) {
  }

  ngOnInit(): void {
    this.productService.getAll().subscribe(okProds => {
      this.productsList = okProds
    })
    this.dataForm = this.formBuilder.group({
      id: [""],
      nombre: ["", Validators.required],
      sku: [""],
      pesofinal: ["0"],
      pesoenvase: ["0"],
      formato: ["", Validators.required],
      unidad: ["", Validators.required],
      condicion: ["normal"],
      stdprod: [""],
      velprod: ["", Validators.required],
      idproducto: ["", Validators.required],
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
    console.log("AA");
    this.isLoading = true

    if (this.editing) {
      this.alerts.editAlert(this.entityName).then((result) => {
        if (result.isConfirmed) {
          console.log("editando");
          let data = {
            id: this.f.id.value,
            nombre: this.f.nombre.value,
            sku: this.f.sku.value,
            pesofinal: this.f.pesofinal.value,
            pesoenvase: this.f.pesoenvase.value,
            formato: this.f.formato.value,
            unidad: this.f.unidad.value,
            condicion: this.f.condicion.value,
            velprod: this.f.velprod.value,
            idproducto: this.f.idproducto.value
          }
          this.service.update(data).subscribe(ok => {
            setTimeout(() => {
              this.service.refreshDataTable().then(okk => {
                console.log(okk);
                console.log(ok);
                this.isLoading = false
                this.alerts
                  .successFullAlert("Operacion realizada exitosamente").then(ok => {
                  this.thisDialogRef.close()
                })
                //this.hide.emit("ocultar");


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
        formato: this.f.formato.value,
        pesofinal: this.f.pesofinal.value,
        pesoenvase: this.f.pesoenvase.value,
        velprod: this.f.velprod.value,
        unidad: this.f.unidad.value,
        condicion: this.f.condicion.value,

        idproducto: this.f.idproducto.value
      }
      console.log(data);
      this.service.create(data).subscribe(ok => {
        this.service.refreshDataTable().then(okk => {
          console.log(okk);
          console.log(ok);
          this.isLoading = false
          //this.hide.emit("ocultar");
          this.alerts
            .successFullAlert("Operacion realizada exitosamente").then(ok => {
            this.thisDialogRef.close()
          })
        })
      }, error => {
        console.log(error.error);
        this.alerts.errorAlert(error)

        this.isLoading = false

      })
    }
  }


}
