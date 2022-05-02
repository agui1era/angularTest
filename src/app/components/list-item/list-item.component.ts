import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.sass']
})
export class ListItemComponent implements OnInit {
  @Input("icon") icon;
  @Input("title") title;
  @Input("comment") comment;

  constructor() { }

  ngOnInit(): void {
  }

}
