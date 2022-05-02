import {Component, Input, OnInit} from '@angular/core';
import {AppComponent} from "@app/app.component";

@Component({
  selector: 'app-mi-loader',
  templateUrl: './mi-loader.component.html',
  styleUrls: ['./mi-loader.component.sass']
})
export class MiLoaderComponent implements OnInit {

  @Input("text") text = ""

  constructor() { }

  ngOnInit(): void {
    console.log("hola");
  try{
    if(AppComponent.noMostrarToolbar == false){
      AppComponent.noMostrarToolbar = true
    }
  }catch (e) {

  }
  }
ngOnDestroy(){
try{

  if(AppComponent.noMostrarToolbar == true){
    AppComponent.noMostrarToolbar = false
  }
}catch (e) {

}
}

}
