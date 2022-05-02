import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-error-form',
  templateUrl: './error-form.component.html',
  styleUrls: ['./error-form.component.sass']
})
export class ErrorFormComponent implements OnInit {

  @Input("textAlert") textAlert


  constructor() { }

  ngOnInit(): void {
  }

}
