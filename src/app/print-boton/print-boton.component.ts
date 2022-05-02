import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-print-boton',
  templateUrl: './print-boton.component.html',
  styleUrls: ['./print-boton.component.sass']
})
export class PrintBotonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  imprimir(){
    window.print()
  }
}
