import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-otcard',
  templateUrl: './otcard.component.html',
  styleUrls: ['./otcard.component.sass']
})
export class OTCardComponent implements OnInit {
  @Input("ot") ot: any = {};
  @Input("btnText") btnText: any = ""
  @Input("afueraFunc") afueraFunc: any = () => {}

  constructor() {
  }


  ngOnInit(): void {

  }

  fin() {
  }


}
