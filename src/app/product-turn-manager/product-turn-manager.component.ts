import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ProductService} from "@app/_services/product.service";
import {TurnService} from "@app/_services/turn.service";
import {Alerts} from "@app/_helpers/alerts";
import {SubproductmachineService} from "@app/_services/subproductmachine.service";
import {MachineService} from "@app/_services/machine.service";
import {MachineProductsManagerComponent} from "@app/machine-products-manager/machine-products-manager.component";
import {Role, User} from "@app/_models";
import {AuthenticationService} from "@app/_services";

@Component({
  selector: 'app-product-turn-manager',
  templateUrl: './product-turn-manager.component.html',
  styleUrls: ['./product-turn-manager.component.sass']
})
export class ProductTurnManagerComponent implements OnInit {

  loading = false

  nSerieInput = ""
  idsubproductoasidgnado: any = {}
  produccionesperada = ""
  formato = ""
  condicion = ""
  unidad = ""
  isProdTurn = false
  allProducts = []
  allProductsTurn = []
  formGroup: FormGroup = new FormGroup({
    id: new FormControl(""),
    subproductoasignado: new FormControl("", Validators.required),
    idproducto: new FormControl("", Validators.required),
    formato: new FormControl("", Validators.required),
    formatocantidad: new FormControl("0", Validators.required),
    serie: new FormControl("", Validators.required),
    condicion: new FormControl("", Validators.required),
  })
  subprodAsociados = []
  activeTurnObj: any = {}
  ultimaProd: any = null
  modificar = false
  productTurnActivo: any = {}
  listaFormatos = []
  listaFormatosUnidad = []
  listaCondicion = []
  user: User;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService,
    private turnService: TurnService,
    private machineService: MachineService,
    private dialogRef: MatDialogRef<ProductTurnManagerComponent>,
    private alerts: Alerts,
    private dialog: MatDialog,
    private subproductsMachineService: SubproductmachineService,
    private authenticationService: AuthenticationService,
  ) {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  get isOperator() {
    return this.user && this.user.role === Role.operador;
  }

  ngOnInit(): void {
    this.authenticationService.user.subscribe(x => this.user = x);

    this.dialogRef.disableClose = true
    this.activeTurnObj = JSON.parse(localStorage.getItem("activeTurn"))
    this.cargarProductTurn()
    this.cargarSubProductos()
    if (!this.isOperator) {
      this.dialogRef.close();
    }
    if(this.data.cerrar){
      this.dialogRef.close();

    }
    /*this.productService.getAll().subscribe(allProducts => {
      this.allProducts = allProducts
    })*/

    /* if (this.data) {
       console.log(this.data);

       let laHoraNow = new Date(this.data.fecha).getHours()
       console.log(laHoraNow);
       console.log(this.data.horasPermitidas)
       let ultProd = this.data.horasPermitidas.find(o => o.text.substring(0, 2) == laHoraNow)
       if (ultProd.cantidad && ultProd.idprodturn_productoturno) {
         this.ultimaProd = ultProd
       }


       /!*  cantidad: "120"
         idprodturn_productoturno: {id: 9, idproducto: "1", idturno: "1", serie: "operador", formato: "l", …}
         text: "14:00"*!/

       this.turnService.getProductTurnByTurn(JSON.parse(localStorage.getItem("activeTurn")).id).subscribe(allProductTurnsOfTurn => {
         this.allProductsTurn = allProductTurnsOfTurn
         this.productoTurnoActivo = this.allProductsTurn.find(o => o.activoenturno)
         console.log(this.productoTurnoActivo);
       })

       this.selectExistent()
     } else {

     }*/

  }

  cargarProductTurn() {
    this.turnService.getProductTurnByTurn(this.activeTurnObj.id).subscribe(productsTurn => {
      this.allProductsTurn = productsTurn
      console.log(this.allProductsTurn);
      this.productTurnActivo = this.allProductsTurn.find(o => o.activoenturno)
      if (this.productTurnActivo) {
        this.idsubproductoasidgnado = parseInt(this.productTurnActivo.idsubproducto)
        this.nSerieInput = this.productTurnActivo.serie
        this.produccionesperada = this.productTurnActivo.cantidadesperada
        this.formato = this.productTurnActivo.formato
        this.unidad = this.productTurnActivo.formatounidad
        this.condicion = this.productTurnActivo.condicion
        console.log(this.productTurnActivo);
        this.listaFormatos = this.productTurnActivo.idsubproducto_subproducto.formato.split(",")
        this.listaFormatosUnidad = this.productTurnActivo.idsubproducto_subproducto.unidad.split(",")
        this.listaCondicion = this.productTurnActivo.idsubproducto_subproducto.condicion.split(",")

        if (this.productTurnActivo.idordendetrabajo) {
          //this.dialogRef.close();
        }
      }
      if (this.allProductsTurn.length >= 1) {
        this.isProdTurn = true
        localStorage.setItem("pt", JSON.stringify(this.allProductsTurn.find(o => o.idsubproducto == this.productTurnActivo.idsubproducto)))
      }
    })
  }

  openMachineProducts() {
    this.dialog.open(MachineProductsManagerComponent, {
      width: "55vw",
      height: "70vh",
    }).afterClosed().subscribe(okClos => {
      this.cargarSubProductos()
    })
  }

  cargarSubProductos() {
    this.loading = true

    this.machineService.getById(this.activeTurnObj.idmaquina_maquina.id).subscribe(okMachineR => {
      //this.idsubproductoasidgnado = parseInt(okMachineR.subproductoasignado)
      this.subproductsMachineService.getAll(this.activeTurnObj.idmaquina_maquina.id).subscribe(subproductsofmachine => {
        this.subprodAsociados = subproductsofmachine
        this.subprodAsociados = this.subprodAsociados.map(o => {
          return {...o, formato: o.idsubproducto_subproducto.formato.split(",")}
        })
        this.subprodAsociados = this.subprodAsociados.map(o => {
          return {...o, unidad: o.idsubproducto_subproducto.unidad.split(",")}
        })
        this.subprodAsociados = this.subprodAsociados.map(o => {
          return {...o, condicion: o.idsubproducto_subproducto.condicion.split(",")}
        })
        console.log(this.subprodAsociados);

        if (subproductsofmachine.length >= 1) {
          localStorage.setItem("sp", JSON.stringify(subproductsofmachine.find(o => o.idsubproducto == okMachineR.subproductoasignado)))
        } else {
          this.machineService.refreshProductsOfMachine(this.activeTurnObj.idmaquina_maquina.id).then(ok => {
            console.log(ok);
          })
        }
        this.loading = false

      })
    })


  }
  cambiarSp(){
    let subprodSelected = this.subprodAsociados.find(o=>o.idsubproducto == this.idsubproductoasidgnado)
    this.listaFormatos = subprodSelected.formato
    this.listaFormatosUnidad = subprodSelected.unidad
    this.listaCondicion = subprodSelected.condicion
  }

  formatosDelProducto() {


    let p = this.allProducts.find(o => o.id == this.formGroup.controls.idproducto.value)
    if (p) {
      return p.formatosdemedida.split(",")
    }

  }

  async guardar() {
    console.log(this.productTurnActivo);

    if (this.productTurnActivo == undefined) {
      let req = {
        id: "",
        serie: this.nSerieInput,
        idsubproducto: this.idsubproductoasidgnado,
        idturno: this.activeTurnObj.id,
        cantidadesperada: this.produccionesperada,
        formato: this.formato,
        formatounidad: this.unidad,
        condicion: this.condicion
      }
      await this.turnService.createProductTurnByTurn(req).toPromise()

    } else {

      await this.turnService.updateProductTurnByTurn({
        id: this.productTurnActivo.id,
        serie: this.nSerieInput,
        idsubproducto: this.idsubproductoasidgnado,
        cantidadesperada: this.produccionesperada,
        formato: this.formato,
        formatounidad: this.unidad,
        condicion: this.condicion

      }).toPromise()
    }
    await this.machineService.update({
      id: this.activeTurnObj.idmaquina_maquina.id,
      suproductoasignado: this.idsubproductoasidgnado
    })
    this.cargarProductTurn()
    this.cargarSubProductos()
    this.modificar = true


  }


  create() {


    if (this.data) {
      this.alerts.editAlert("Producto del turno").then(ok => {
        if (ok.isConfirmed) {
          /* let req = {
             id: this.formGroup.controls.id.value,
             idproducto: this.formGroup.controls.idproducto.value,
             formato: this.formGroup.controls.formato.value,
             formatounidad: this.formGroup.controls.formatocantidad.value,
             serie: this.formGroup.controls.serie.value,
             condicion: this.formGroup.controls.condicion.value,
             idturno: JSON.parse(localStorage.getItem("activeTurn")).id
           }*/
          let req = {
            id: this.formGroup.controls.id.value,
            serie: this.nSerieInput,
            idsubproducto: this.idsubproductoasidgnado,
            idturno: JSON.parse(localStorage.getItem("activeTurn")).id
          }
          this.turnService.createProductTurnByTurn(req).subscribe(ok => {
            console.log(ok);
            if (this.ultimaProd) {
              let data = {
                idprodturn: ok.id,
                hora: this.ultimaProd.text.substring(0, 5),
                cantidad: this.ultimaProd.cantidad
              }
              this.turnService.createProductionByProductTurn(data).subscribe(ok => {
                console.log(ok);

                this.closeDialog()

              })
            } else {
              this.closeDialog()

            }


          })

        }
      })


    } else {
      console.log("hola");
      let req = {
        id: "",
        serie: this.nSerieInput,
        idsubproducto: this.idsubproductoasidgnado,
        idturno: JSON.parse(localStorage.getItem("activeTurn")).id
      }
      this.turnService.createProductTurnByTurn(req).subscribe(ok => {
        console.log(ok);
        this.closeDialog()


      })
    }
  }

  selectExistent() {
    console.log(this.formGroup.controls.id.value);
    let existentData = this.data
    this.formGroup.controls.id.setValue(existentData.id)
    this.formGroup.controls.idproducto.setValue(existentData.idproducto)
    this.formGroup.controls.formato.setValue(existentData.formato)
    this.formGroup.controls.formatocantidad.setValue(existentData.formatounidad)
    this.formGroup.controls.serie.setValue(existentData.serie)
    this.formGroup.controls.condicion.setValue(existentData.condicion)
  }

  endTurn() {
    let idTurno = JSON.parse(localStorage.getItem("pendingTurns"))[0].id
    // this.closeFullscreen()
    // this.isActiveTurn = false;
    this.turnService.end(idTurno).subscribe(ok => {
      localStorage.removeItem("pendingTurns")
      localStorage.removeItem("activeTurn")
      this.turnService.refreshActiveTurns()
      console.log(ok)
      this.turnService.dataManagerChangeValue(false)
      location.reload()
    })
  }


  rcg() {
    location.reload()
  }
}
