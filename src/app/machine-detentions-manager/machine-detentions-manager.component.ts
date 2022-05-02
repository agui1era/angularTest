import {Component, OnInit} from '@angular/core';
import {CategoryDetentionService} from "@app/_services/categoryDetention.service";
import {MachineService} from "@app/_services/machine.service";
import {DetentionService} from "@app/_services/detention.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-machine-detentions-manager',
  templateUrl: './machine-detentions-manager.component.html',
  styleUrls: ['./machine-detentions-manager.component.sass']
})
export class MachineDetentionsManagerComponent implements OnInit {
  selectedDetentions = []
  categoryDetentionList = []
  allDetentionsList = []
  allDetentionsSelect = []
  displayedColumns: string[] = ['activo', 'nombre', 'editar', 'eliminar'];
  dataSource: any = [];
  nameNueva = ""
  selectsDetentionList = []
  respaldoSelectsDetentionList = []

  respaldoDetentionsList = []

  selectedInCatDet: any = ""
  selectedAll: any;


  constructor(
    private service: MachineService,
    private service5: CategoryDetentionService,
    private detentionService: DetentionService,
    private _snackBar: MatSnackBar

  ) {
  }

  ngOnInit(): void {
    this.service5.getAll().subscribe(objects5 => {

      this.categoryDetentionList = objects5
      this.selectedInCatDet = objects5[0]

      for (let cat of this.categoryDetentionList) {
        this.selectedDetentions[cat.nombre] = []
      }

    })


    this.service.machineDetentions.subscribe((ok: any) => {
      this.detentionService.getAll().subscribe(okD => {

        this.allDetentionsSelect = okD.filter(o => o.idmaqrel == null)
        console.log(this.allDetentionsSelect);
        this.respaldoDetentionsList = this.allDetentionsSelect
        if (ok) {
          console.log(ok);
          this.allDetentionsList = ok.map(o => o.idparada_parada ? o.idparada_parada : o)
          console.log(this.allDetentionsList);
          this.selectsDetentionList = this.allDetentionsSelect.map(o => {
            return {
              ...o,
              activo: !!this.allDetentionsList.find(p => p.nombre == o.nombre),
              machineDet: this.allDetentionsList.find(p => p.nombre == o.nombre)
            }
          })
          console.log(this.selectsDetentionList);
          this.respaldoSelectsDetentionList = this.selectsDetentionList
          this.dataSource = new MatTableDataSource(this.respaldoSelectsDetentionList.filter(o => o.idcategoriaparada == this.selectedInCatDet.id));
          this.checkIfAllSelected()
        }
      })
    })


  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'cerrar', {duration: 1700});
  }
  addDetention(data) {
    this.allDetentionsList.push({
      idcategoriaparada: data.id,
      nombre: '',
      inventarioreq: data.requiereInventario ? false : null
    })
    this.service.machineDetentionsChangeValue(this.allDetentionsList)


  }

  selectCatDet(cat) {
    this.selectedInCatDet = cat
    this.dataSource = new MatTableDataSource(this.respaldoSelectsDetentionList.filter(o => o.idcategoriaparada == this.selectedInCatDet.id));
    this.checkIfAllSelected()
  }

  deleteDetention(i, dataCategory, dataDetention) {


    this.allDetentionsList.splice(i, 1);

    if (dataDetention.id) {
      this.service.deleteMachineDetention(dataDetention.id).subscribe(ok => {
        console.log(ok);
        this.service.machineDetentionsChangeValue(this.allDetentionsList)

      })
    }
  }
  selectAll() {
    console.log(this.respaldoSelectsDetentionList.filter(o => o.idcategoriaparada == this.selectedInCatDet.id));
    for (var i = 0; i < this.respaldoSelectsDetentionList.filter(o => o.idcategoriaparada == this.selectedInCatDet.id).length; i++) {
      let elDetention =this.respaldoSelectsDetentionList.filter(o => o.idcategoriaparada == this.selectedInCatDet.id)[i]
      if(elDetention.activo != this.selectedAll){
        elDetention.activo = this.selectedAll;
        this.activar(this.respaldoSelectsDetentionList.filter(o => o.idcategoriaparada == this.selectedInCatDet.id)[i])
      }

    }
  }
  checkIfAllSelected() {
    if (this.respaldoSelectsDetentionList.filter(o => o.idcategoriaparada == this.selectedInCatDet.id).length == 0) {
      this.selectedAll = false
    }else{
      this.selectedAll = this.respaldoSelectsDetentionList.filter(o => o.idcategoriaparada == this.selectedInCatDet.id).every(function(item:any) {
        return item.activo == true;
      })
    }


  }


  changeDetention(obj) {
    console.log(obj);

    this.service.machineDetentionsChangeValue(this.allDetentionsList)


    if (obj.id) {
      this.service.updateMachineDetention({
        id: obj.id,
        nombre: obj.nombre,
        idcategoriaparada: obj.idcategoriaparada,
        inventarioreq: obj.inventarioreq
      }).subscribe(ok => {
        console.log(ok);
      })
    }


  }

  refrescarParadas() {

  }

  editarParada(elm) {
    if(elm.machineDet){
      this.detentionService.update({id:elm.machineDet.id,nombre:elm.nombre}).subscribe(okDet=>{
      })
    }
    this.detentionService.update({id:elm.id,nombre:elm.nombre}).subscribe(okDet=>{
      elm.isEdit = false
    })
  }

  borrarParada(elm) {
    if(elm.machineDet){
      console.log(elm.machineDet.id)
      this.detentionService.delete(elm.machineDet.id).subscribe(okDet=>{
      })
    }
    this.detentionService.delete(elm.id).subscribe(okDet=>{
      elm.isEdit = false
      this.service.refreshDetentionsOfMachine(this.service.machineInEditIdValue)
    })
  }


  createNueva() {
    let idMachine = this.service.machineInEditIdValue
    let req = {
      nombre: this.nameNueva,
      idcategoriaparada: this.selectedInCatDet.id
    }
    this.service.createDetentionsOfMachine([req], idMachine).subscribe(ok => {
      this.service.refreshDetentionsOfMachine(idMachine).then(okParadasRefresh => {
        this.nameNueva = ""
        this.checkIfAllSelected()
      })
    })

  }

  activar(elem) {
    console.log(elem);
    if (elem.activo) {
      console.log("agregando");
      let idMachine = this.service.machineInEditIdValue
      let req = {
        nombre: elem.nombre,
        idcategoriaparada: elem.idcategoriaparada
      }
      console.log(req);
      console.log(idMachine);
      this.service.createDetentionsOfMachine([req], idMachine).subscribe(ok => {
        console.log(ok);
        elem.machineDet = ok[0]
        this.openSnackBar("Acción realizada correctamente")
      })

    } else {
      console.log("borrando");
      this.detentionService.delete(elem.machineDet.id).subscribe(ok => {
        console.log(ok);
        this.openSnackBar("Acción realizada correctamente")
      })
    }


  }


}
