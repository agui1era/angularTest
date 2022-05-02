import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {MaintenanceInventoryService} from "@app/_services/maintenanceInventory.service";
import {InventoryService} from "@app/_services/inventory.service";

@Component({
  selector: 'app-inventory-maintenance-manager',
  templateUrl: './inventory-maintenance-manager.component.html',
  styleUrls: ['./inventory-maintenance-manager.component.sass']
})
export class InventoryMaintenanceManagerComponent implements OnInit {

  aa = 1

  showAdder = false
  allList = []
  allInventories = []
  invSelect: any = ""
  cantInput = ""
  nameMantencion = ""
  displayedColumns = ["inventario", "cantidad", "editar", "eliminar"]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any = false,
    private invmantService: MaintenanceInventoryService,
    private inventarioService: InventoryService
  ) {
  }

  ngOnInit(): void {
    console.log(this.data);
    this.nameMantencion = this.data.detention.nombre
    this.loadInventories()
    this.inventarioService.getAll().subscribe(ok => {
      console.log(ok);
      this.allInventories = ok
    })
  }

  loadInventories() {
    this.invmantService.getAll(this.data.detention.id).subscribe(ok => {
      console.log(ok);
      this.allList = ok
    })
  }

  saveMantInv() {
    let req = {
      idinventario: this.invSelect.id,
      cantidad: this.cantInput,
      tipo: this.data.detention.id,
    }
    console.log(req);
    this.invmantService.create(req).subscribe(createdInvMant => {
      console.log(createdInvMant);
      this.showAdder = false
      this.loadInventories()

    })
  }

  edit(element){
    let req = {
      id:element.id,
      cantidad:element.cantidad,
      idinventario:element.idinventario_inventario.id
    }
    console.log(req);
    this.invmantService.update(req).subscribe(ok=>{
      console.log(ok);
    })


  }


  cancel() {
    this.loadInventories()
  }

  deleteMantInv(element) {
    this.invmantService.delete(element).subscribe(okDeleted => {
      console.log(okDeleted);
      this.loadInventories()
    })
  }


}
