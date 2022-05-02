import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';

import {User} from '../../_models';
import {UserService} from '../../_services';

@Component({templateUrl: 'maquina.component.html'})
export class MaquinaComponent implements OnInit {
  loading = false;
  users: User[] = [];
  view = "kpis";
  constructor(private userService: UserService) {
  }

  elegir = vista => {
    console.log(vista)
    this.view = vista
  }


  ngOnInit() {
    this.loading = true;
    /*this.userService.getAll().pipe(first()).subscribe(users => {
        this.loading = false;
        this.users = users;
    });*/
  }
}
