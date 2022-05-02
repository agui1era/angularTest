import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "@app/_services/product.service";
import Swal from "sweetalert2";
import {Alerts} from "@app/_helpers/alerts";
import {MatDialog} from "@angular/material/dialog";
import {InterruptionManagerComponent} from "@app/interruption-manager/interruption-manager.component";
import {SubProductManagerComponent} from "@app/events/subproducto/subproduct-manager/subproduct-manager.component";
import {SubproductService} from "@app/_services/subproduct.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.sass']
})
export class ProductManagerComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  error = '';
  editing = false;
  isLoading = false;
  entityName = "producto"
  allObjectslist = []
  @Output() hide = new EventEmitter<string>();

  displayedColumns = ["nombre", "unidad", "formato", "condicion", "sku", "velprod", /*"stdprod",*/ "editar", "eliminar"]


  constructor(
    private formBuilder: FormBuilder,
    private service: ProductService,
    private subProductService: SubproductService,
    private alerts: Alerts,
    private dialog: MatDialog,
    private router:Router
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.formBuilder.group({
      id: [""],
      nombre: ["", Validators.required],
      categoria: [""],
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
        this.loadSubOjects()


      }
    })


  }



  get f() {
    return this.dataForm.controls;
  }

  loadSubOjects() {
    return new Promise((o, n) => {
      this.subProductService.getAll().subscribe(allObj => {
        this.allObjectslist = allObj.filter(o => o.idproducto == this.f.id.value)
        this.allObjectslist = this.allObjectslist.map(o => {return {...o,formatoD:o.formato.split(",")}})
        this.allObjectslist = this.allObjectslist.map(o => {return {...o,unidadD:o.unidad.split(",")}})
        this.allObjectslist = this.allObjectslist.map(o => {return {...o,condicionD:o.condicion.split(",")}})
        console.log(this.allObjectslist);

        o(allObj)

      }, error => {
        n(error)

      })

    })
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
            categoria: this.f.categoria.value,
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
        categoria: this.f.categoria.value,
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

  openCreateSubProduct(edit=false) {

    if(!edit){
      this.subProductService.dataManagerChangeValue(false)
    }
    const dialogRef = this.dialog.open(SubProductManagerComponent, {
      data: {}
    });
    dialogRef.afterClosed().subscribe(ok => {
      this.loadSubOjects()
    })
  }


  editSubObject(obj) {
    console.log(obj);
   /* obj.formato = obj.formato.join(",")
    obj.unidad = obj.unidad.join(",")
    obj.condicion = obj.condicion.join(",")*/
    console.log(obj);
    this.subProductService.dataManagerChangeValue(obj)
    this.openCreateSubProduct(true)
    /* this.alerts.editAlert("Parada").then(resu => {
       if (resu.isConfirmed) {
         let req = {
           id: obj.id,
           nombre: obj.nombre
         }
         this.subProductService.update(req).subscribe(ok => {
           console.log(ok);
           obj.isEdit = false
         })
       }
     })*/

  }

  createSubObject() {

    /* console.log(this.f.id.value);
     this.subProductService.create({
       idcategoriaparada: this.f.id.value
     }).subscribe(ok => {
       console.log(ok);
       this.loadSubOjects()
     })*/
  }

  deleteSubObject(id) {
    this.subProductService.delete(id).subscribe(ok => {
      console.log(ok);
      this.loadSubOjects()
    })
  }


}
