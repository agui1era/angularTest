import {Component, Inject, OnInit} from '@angular/core';
import {TurnService} from "@app/_services/turn.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Alerts} from "@app/_helpers/alerts";

@Component({
  selector: 'app-add-production-manager',
  templateUrl: './add-production-manager.component.html',
  styleUrls: ['./add-production-manager.component.sass']
})
export class AddProductionManagerComponent implements OnInit {

  isActiveTurnObj: any = {};
  productTurnList = []
  horariosManiana = ["07:00 a 08:00", "08:00 a 09:00", "09:00 a 10:00", "10:00 a 11:00", "11:00 a 12:00", "12:00 a 13:00", "13:00 a 14:00"]
  horariosTarde = ["14:00 a 15:00", "15:00 a 16:00", "16:00 a 17:00", "17:00 a 18:00", "18:00 a 19:00", "19:00 a 20:00", "20:00 a 21:00", "21:00 a 22:00"]
  horariosNoche = ["22:00 a 23:00", "23:00 a 00:00", "00:00 a 01:00", "01:00 a 02:00", "02:00 a 03:00", "03:00 a 04:00", "04:00 a 05:00", "05:00 a 06:00", "06:00 a 07:00"]
  cantidadInput = 0
  horasDisponibles = []
  allProductsTurn = []
  productoTurnoActivo:any = {}

  constructor(
    private service: TurnService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddProductionManagerComponent>,
    private alerts: Alerts,
  ) {
  }

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.cantidad) {
      this.cantidadInput = this.data.cantidad
    }
    this.isActiveTurnObj = {idturno_turno:JSON.parse(localStorage.getItem("activeTurn")),idturno:JSON.parse(localStorage.getItem("activeTurn")).id}
    this.service.getProductTurnByTurn(this.isActiveTurnObj.idturno).subscribe(allProductTurnsOfTurn => {
      this.allProductsTurn = allProductTurnsOfTurn
      this.productoTurnoActivo = this.allProductsTurn.find(o=>o.activoenturno)

    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getProductTurn() {

    this.service.getProductTurnByTurn(this.isActiveTurnObj.idturno).subscribe(productTurnsList => {
      console.log(productTurnsList);
      this.productTurnList = productTurnsList.body
      for (let production of productTurnsList.body) {
        this.getProductionByProductTurn(production.id)

      }
    })

  }

  registrar() {
    if (this.data.cantidad) {
      this.alerts.editAlert("produccion").then(ok => {

        if (ok.isConfirmed) {
          let req = {
           // "idprodturn": this.productoTurnoActivo.id,
            "idprodturn": this.data.prodTurn.id,
            "hora": this.data.text.substring(0, 5),
            "cantidad": this.cantidadInput
          }
          this.service.createProductionByProductTurn(req).subscribe(ok => {
            this.closeDialog()
            console.log(ok);
          })
        }
      })
    } else {
      let req = {
        //"idprodturn": this.productoTurnoActivo.id,
        "idprodturn": this.data.prodTurn.id,
        "hora": this.data.text.substring(0, 5),
        "cantidad": this.cantidadInput
      }
      this.service.createProductionByProductTurn(req).subscribe(ok => {
        this.closeDialog()
        console.log(ok);
      })
    }
  }


  createProducTurn() {
    let idturno = this.isActiveTurnObj.idturno

    console.log(this.isActiveTurnObj)
    this.service.createProductTurnByTurn({idturno}).subscribe(productTurnCreated => {
      console.log(productTurnCreated);
      this.getProductTurn()
    })

  }

  horas() {
    let horario = this.service.horarioValue
    //console.log(horario);
    return horario == 'mañana' ?
      this.horariosManiana : horario == 'tarde' ?
        this.horariosTarde : horario == 'noche' ? this.horariosNoche : ''

  }

  addProduction(hora, cantidad, objprodturn) {
    let data = {
      idprodturn: objprodturn.id,
      hora: hora.substring(0, 5),
      cantidad
    }
    this.service.createProductionByProductTurn(data).subscribe(ok => {
      console.log(ok);

    })
    this.hoursSum(objprodturn)

  }

  hoursSum(obj) {
    let value = 0
    for (let h of this.horas()) {
      value += obj.horas ? +obj.horas[h]?.cantidad : 0

    }
    return value
  }

  getProductionByProductTurn(id) {
    this.service.getProductionByProductTurn(id).subscribe(productionOfProductTurn => {


      console.log(productionOfProductTurn);
      console.log(this.productTurnList.find(o => o.id == id));
      for (let i = 0; i < this.productTurnList.length; i++) {
        if (this.productTurnList[i].id == id) {
          console.log("si");
          console.log(i);
          let hours = {}
          for (let h of this.horas()) {
            let name = h
            hours[h] = {
              name,
              cantidad: 0
            }

          }
          for (let hExistent of productionOfProductTurn) {
            console.log(hours);
            console.log(hExistent);
            for (let h of Object.keys(hours)) {
              if (h.substring(0, 5) == hExistent.hora) {
                hours[h].cantidad = hExistent.cantidad
              }
            }
          }
          console.log(hours);

          this.productTurnList[i].horas = hours
          console.log(this.productTurnList);

        }
      }

    })
  }

}
