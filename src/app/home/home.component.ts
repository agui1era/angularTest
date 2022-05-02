import {Component} from '@angular/core';

import {Role, User} from '@app/_models';
import {AuthenticationService, UserService} from '@app/_services';
import {Router} from "@angular/router";
import {TurnService} from "@app/_services/turn.service";

@Component(
  {templateUrl: 'home.component.html',
    styleUrls:["home.component.sass"]
  }
)
export class HomeComponent {
  loading = false;
  user: User;
  userFromApi: User;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private route: Router,
    private turnService: TurnService
  ) {
    this.user = this.authenticationService.userValue;

  }

  ngOnInit() {


    if(!localStorage.getItem("logged")){
      //location.reload()
      localStorage.setItem("logged","true")
    }


    /*this.loading = true;
    *//*  this.userService.getById(this.user.id).pipe(first()).subscribe(user => {
          this.loading = false;
          this.userFromApi = user;
      });*/
    if (this.user.role as String == "operador" && this.turnService.activeTurnsValue.length>=1) {
      this.route.navigateByUrl("/maquina/" + this.turnService.activeTurnsValue[0].idturno_turno.idmaquina)
    }else if(this.user.role as String == "operador" && this.turnService.activeTurnsValue.length == 0){
      this.route.navigateByUrl("/plantas")
    }else if(this.user.role as String == "supervisor" || this.user.role as String == "administrador"){
      this.route.navigateByUrl("/vista-empresa")
    }
  }

  info() {
    this.authenticationService.info().subscribe(okInfo => {
      console.log(okInfo);


    })
  }
}
