import {Component, Inject, OnInit} from '@angular/core';
import {TurnService} from "@app/_services/turn.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-velocidad-manager',
  templateUrl: './velocidad-manager.component.html',
  styleUrls: ['./velocidad-manager.component.sass']
})
export class VelocidadManagerComponent implements OnInit {
  inputVelocidad = 0

  constructor(
    private turnService: TurnService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<VelocidadManagerComponent>,
  ) {
  }

  ngOnInit(): void {
    console.log(this.data);

    if (this.data) {
      this.inputVelocidad = this.data.pt.velocidad
    }

  }

  cambiarVelocidad() {
    let req = {
      velocidad: this.inputVelocidad,
      id: this.data.pt.id
    }
    console.log(req);
    this.turnService.updateProductTurnByTurn(req).subscribe(ok => {
      this.dialogRef.close()
    })
  }


}
