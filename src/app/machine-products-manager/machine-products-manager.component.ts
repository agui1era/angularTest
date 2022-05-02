import {Component, Input, OnInit} from '@angular/core';
import {ProductService} from "@app/_services/product.service";
import {MachineService} from "@app/_services/machine.service";
import {SubproductmachineService} from "@app/_services/subproductmachine.service";
import {Alerts} from "@app/_helpers/alerts";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-machine-products-manager',
  templateUrl: './machine-products-manager.component.html',
  styleUrls: ['./machine-products-manager.component.sass']
})
export class MachineProductsManagerComponent implements OnInit {
  @Input('inModal') inModal = true
  selectedProducts = []
  productsList = []
  selectedProduct: any = {}
  machineBegin: any = ""
  machineSubProducts = []
  busqueda = ""
  subProductsSelectedResp = []
  selectedAll: any;

  constructor(
    private service: MachineService,
    private service3: ProductService,
    private spmachineService: SubproductmachineService,
    private alerts: Alerts,
    private router: Router,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
  }

  cerrarTodo() {
    this.dialog.closeAll()
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'cerrar', {duration: 1700});
  }

  ngOnInit(): void {
    this.machineBegin = this.service.machineInEditIdValue
    console.log(this.machineBegin);
    this.spmachineService.getAll(this.machineBegin).subscribe(okspMachine => {
      console.log(okspMachine);
      this.machineSubProducts = okspMachine
    })

    this.service.machineProducts.subscribe((ok: any) => {
      if (ok) {
        console.log(ok);
        console.log(ok.map(o => {
          return {...o, value: o.idproducto ? o.idproducto : o.value}
        }));
        this.selectedProducts = ok.map(o => {
          return {...o, value: o.idproducto ? o.idproducto : o.value}
        })
      }
    })
    this.service3.getAll('s').subscribe(objects3 => {
      this.productsList = objects3
    })
  }
  selectAll() {
    for (var i = 0; i < this.subProductsSelectedResp.filter(o => o.idproducto == this.selectedProduct.id).length; i++) {
      let elSp = this.subProductsSelectedResp.filter(o => o.idproducto == this.selectedProduct.id)[i]
      console.log(elSp.activo);
      console.log(this.selectedAll);
      console.log(elSp.activo != this.selectedAll);
      if(elSp.activo != this.selectedAll){
       elSp.activo = this.selectedAll;
        this.elegirSubProduct(this.subProductsSelectedResp.filter(o => o.idproducto == this.selectedProduct.id)[i])

      }
    }
  }
  addProduct() {
    this.selectedProducts.push({value: 0})
    this.service.machineProductsChangeValue(this.selectedProducts)
  }

  deleteProduct(i, d) {
    console.log(d);
    console.log(i);
    this.selectedProducts.splice(i, 1);
    this.service.machineProductsChangeValue(this.selectedProducts)

    if (d.id) {
      this.service.deleteMachineProduct({id: d.id}).subscribe(ok => {
        console.log(ok);
      })
    }
  }

  cambiarSubProducts() {
    console.log(this.selectedProduct.subproductos);
    console.log(this.machineSubProducts);
    for (let sp of this.selectedProduct.subproductos) {
      let finded = this.machineSubProducts.find(o => o.idsubproducto == sp.id)
      if (finded) {
        sp.activo = true
        sp.idRel = finded.id
      }
    }
    this.subProductsSelectedResp = this.selectedProduct.subproductos
    this.checkIfAllSelected()
  }

  irAProducto(p) {
    console.log(p);
    this.dialog.closeAll()
    this.router.navigate(['/datos/Productos'], {state: {data: p}});
  }

  changeProduct(data, event, i) {
    console.log(event);
    console.log(data);
    if (data.id) {
      this.service.updateMachineProduct({id: data.id, idproducto: event}).subscribe(ok => {
        console.log(ok);
      })
    }
    this.selectedProducts[i].idproducto = event
    this.service.machineProductsChangeValue(this.selectedProducts)
  }

  buscar() {
    console.log(this.selectedProduct.subproductos);
    console.log(this.busqueda);
    if (this.busqueda) {

      let filtrados = this.subProductsSelectedResp.filter(o => `${o.nombre} ${o.unidad} ${o.formato} ${o.condicion}`
        .toUpperCase().includes(this.busqueda.toUpperCase()))
      this.selectedProduct.subproductos = filtrados

    } else {
      this.selectedProduct.subproductos = this.subProductsSelectedResp

    }
  }
  checkIfAllSelected() {
    if (this.subProductsSelectedResp.filter(o => o.idproducto == this.selectedProduct.id).length == 0) {
      this.selectedAll = false
    }else{
      this.selectedAll = this.subProductsSelectedResp.filter(o => o.idproducto == this.selectedProduct.id).every(function(item:any) {
        return item.activo == true;
      })
    }
  }
  elegirSubProduct(subproduct) {
    console.log(subproduct.activo);
    if (subproduct.activo) {
      let req = {
        idmaquina: this.machineBegin,
        idsubproducto: subproduct.id
      }
      this.spmachineService.create(req).subscribe(okspm => {
        console.log(okspm);
        subproduct.idRel = okspm.id
        this.spmachineService.dataManagerChangeValue([''])
        this.openSnackBar('Subproducto asignado')
      })
    } else {
      this.spmachineService.delete(subproduct.idRel).subscribe(okDel => {
        console.log(okDel);

        if (okDel?.error) {
          subproduct.activo = true
          this.alerts.errorAlert(okDel)
        } else {
          this.spmachineService.dataManagerChangeValue([''])
          this.openSnackBar('Subproducto eliminado')
        }
      })


    }


  }

}
