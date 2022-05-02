import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {MaquinaComponent} from "./components/maquina";
import {AuthGuard} from './_helpers';
import {Role} from './_models';
import {DataManagerComponent} from "@app/events/data-manager/data-manager.component";
import {PlantSelectionComponent} from "@app/plant-selection/plant-selection.component";
import {MachineSelectionComponent} from "@app/machine-selection/machine-selection.component";
import {ProcessSelectionComponent} from "@app/process-selection/process-selection.component";
import {MachineTurnManagerComponent} from "@app/machine-turn-manager/machine-turn-manager.component";
import {SelectedMachineComponent} from "@app/selected-machine/selected-machine.component";
import {OeeComponent} from "@app/oee/oee.component";
import {InterrupcionesComponent} from "@app/interrupciones/interrupciones.component";
import {MantencionesComponent} from "@app/mantenciones/mantenciones.component";
import {MensajesComponent} from "@app/mensajes/mensajes.component";
import {AlertasComponent} from "@app/alertas/alertas.component";
import {AlertDetentionComponent} from "@app/alert-detention/alert-detention.component";
import {ProductionInputComponent} from "@app/production-input/production-input.component";
import {VistaEmpresaComponent} from "@app/vista-empresa/vista-empresa.component";
import {ReportesComponent} from "@app/reportes/reportes.component";
import {VistaOtComponent} from "@app/vista-ot/vista-ot.component";
import {PlanificadorVistaComponent} from "@app/planificador-vista/planificador-vista.component";
import {MonitoreoComponent} from "@app/monitoreo/monitoreo.component";
import {AnaliticaComponent} from "@app/analitica/analitica.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'oee',
    component: OeeComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.admin,Role.supervisor]}

  },
  {
    path: 'orden-trabajo',
    component: VistaOtComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.admin,Role.supervisor]}

  },
  {
    path: 'planificador',
    component: PlanificadorVistaComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.admin,Role.supervisor]}

  },
  {
    path: 'mantenciones',
    component: MantencionesComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.admin,Role.supervisor]}
  },
  {
    path: 'produccion-anotar',
    component: ProductionInputComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'vista-empresa',
    component: VistaEmpresaComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.admin,Role.supervisor]}

  },
  {
    path: 'interrupciones',
    component: InterrupcionesComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.admin,Role.supervisor]}


  },
  {
    path: 'maquina',
    component: MaquinaComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'mensajes',
    component: MensajesComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'alertas',
    component: AlertasComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'plantas',
    component: PlantSelectionComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.operador]}


  },
  {
    path: 'procesos/:id',
    component: ProcessSelectionComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.operador]}


  },
  {
    path: 'maquinas/:id',
    component: MachineSelectionComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.operador]}


  },
  {
    path: 'analitica',
    component: AnaliticaComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.admin,Role.supervisor]}
  },
  {
    path: 'monitoreo',
    component: ReportesComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.admin,Role.supervisor]}
  },
  {
    path: 'maquina/:id',
    component: SelectedMachineComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.operador]}


  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'datos/:id',
    component: DataManagerComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.admin]}
  },

  // otherwise redirect to home
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
