import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-ver-interrupcion',
  templateUrl: './ver-interrupcion.component.html',
  styleUrls: ['./ver-interrupcion.component.sass']
})
export class VerInterrupcionComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef2: MatDialogRef<VerInterrupcionComponent>,

  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
