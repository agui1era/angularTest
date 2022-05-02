import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-detalle-scheduler-data-sensor',
  templateUrl: './detalle-scheduler-data-sensor.component.html',
  styleUrls: ['./detalle-scheduler-data-sensor.component.sass']
})
export class DetalleSchedulerDataSensorComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
  }

}
