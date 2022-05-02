import {Component, OnInit} from '@angular/core';
import {UserService} from '@app/_services/user.service'
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-data-manager',
  templateUrl: './data-manager.component.html',
  styleUrls: ['./data-manager.component.sass']
})
export class DataManagerComponent implements OnInit {
  parameters = "";
  presetObject:any = {}

  menuSelected = "Empresa"

  menuList =
    [

      {
        name: "Empresa",
        logo: "settings"
      },
      {
        name: "Usuarios",
        logo: "manage_accounts"
      },
      {
        name: "Categoria de parada",
        logo: "report"
      },

      {
        name: "Productos",
        logo: "category"
      },
      {
        name: "Mermas",
        logo: "category"
      },
      {
        name: "Plantas",
        logo: "precision_manufacturing"
      },
      {
        name: "Procesos",
        logo: "list_alt"
      },
      {
        name: "Maquinas",
        logo: "settings",
      },

      {
        name: "Sensor",
        logo: "settings",
      },


      {
        name: "Repuestos",
        logo: "handyman"
      }
      /*{
        name: "SubProductos",
        logo: "pro"
      },*/


    ]


  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private router:Router
  ) {
  }

  selectMenu(menu) {
    console.log(menu);
    this.router.navigate(["datos/"+menu])

    //this.menuSelected = menu
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: any) => {
      this.parameters = params.get('id');
      console.log(history.state.data);
      this.presetObject = history.state.data
      console.log(this.parameters);
      let opt = this.menuList.find(o => o.name.toUpperCase() == this.parameters.toUpperCase())
      if (opt) {
        this.menuSelected = opt.name
      }
    });

  }

}
