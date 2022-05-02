import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-basic-menu',
  templateUrl: './basic-menu.component.html',
  styleUrls: ['./basic-menu.component.sass']
})
export class BasicMenuComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog :MatDialog

  ) { }

  ngOnInit(): void {
  }
  abrirMenu(menu){
    this.dialog.open(menu,{
      width:"80vw",
      height:"70vh"
    })
  }

}
