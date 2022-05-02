import {LOCALE_ID, NgModule} from '@angular/core';
import localeEs from '@angular/common/locales/es'
import {registerLocaleData} from "@angular/common";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from "@angular/material/core";
//import {NgxTimeSchedulerResizeModule} from 'ngx-time-scheduler-resize';
//import {NgxTimeSchedulerModule} from 'ngx-time-scheduler/projects/ngx-time-scheduler/src/lib/ngx-time-scheduler.module'
registerLocaleData(localeEs, 'es')
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {ChartModule, HIGHCHARTS_MODULES} from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import * as pareto from 'highcharts/modules/pareto'
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {fakeBackendProvider} from './_helpers';
import {MatSidenavModule} from '@angular/material/sidenav';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {JwtInterceptor, ErrorInterceptor} from './_helpers';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {MaquinaComponent} from "./components/maquina";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MaquinalabelkpisComponent} from './components/maquinalabelkpis/maquinalabelkpis.component';
import {MaquinalabelconfigComponent} from './components/maquinalabelconfig/maquinalabelconfig.component';
import {AgregarMaquinaComponent} from './components/agregar-maquina/agregar-maquina.component';
import {ListItemComponent} from './components/list-item/list-item.component'
import {DataManagerComponent} from './events/data-manager/data-manager.component'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {UsersManagerComponent} from './events/usuario/users-manager/users-manager.component';
import {PlantManagerComponent} from './events/planta/plant-manager/plant-manager.component'
import {MachineManagerComponent} from "@app/events/maquina/machine-manager/machine-manager.component";
import {UserDataTableComponent} from './events/usuario/user-data-table/user-data-table.component'
import {ProcessManagerComponent} from "@app/events/proceso/process-manager/process-manager.component";
import {ProductManagerComponent} from "@app/events/producto/product-manager/product-manager.component";
import {InventoryManagerComponent} from "@app/events/inventario/inventory-manager/inventory-manager.component";
import {MachineDataTableComponent} from './events/maquina/machine-data-table/machine-data-table.component'
import {SubProductManagerComponent} from "@app/events/subproducto/subproduct-manager/subproduct-manager.component";
import {SubProductDataTableComponent} from "@app/events/subproducto/subproduct-data-table/subproduct-data-table.component";
import {PlantDataTableComponent} from './events/planta/plant-data-table/plant-data-table.component'
import {ProcessDataTableComponent} from './events/proceso/process-data-table/process-data-table.component'
import {InventoryDataTableComponent} from "@app/events/inventario/inventory-data-table/inventory-data-table.component";
import {ProductDataTableComponent} from "@app/events/producto/product-data-table/product-data-table.component";
import {CategoryDetentionDataTableComponent} from './events/categoriadeparada/category-detention-data-table/category-detention-data-table.component'
import {CategoryDetentionDataManagerComponent} from './events/categoriadeparada/category-detention-data-manager/category-detention-data-manager.component'
  ;
import {ErrorFormComponent} from './components/error-form/error-form.component'
  ;
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {MatIconModule} from "@angular/material/icon";
import {PlantSelectionComponent} from './plant-selection/plant-selection.component'
  ;
import {ProcessSelectionComponent} from './process-selection/process-selection.component';
import {MachineSelectionComponent} from './machine-selection/machine-selection.component';
import {SelectedMachineComponent} from './selected-machine/selected-machine.component';


import {MachineProductsManagerComponent} from './machine-products-manager/machine-products-manager.component'
  ;
import {MachineDetentionsManagerComponent} from './machine-detentions-manager/machine-detentions-manager.component'
  ;
import {MachineTurnManagerComponent} from './machine-turn-manager/machine-turn-manager.component'
import {OeeComponent} from './oee/oee.component'
  ;
import {InterrupcionesComponent} from './interrupciones/interrupciones.component'
import {MantencionesComponent} from './mantenciones/mantenciones.component'
import {Alerts} from "@app/_helpers/alerts";
import {InmersiveTurnComponent} from './inmersive-turn/inmersive-turn.component'
  ;
import {MensajesComponent} from './mensajes/mensajes.component'
  ;
import {AlertasComponent} from './alertas/alertas.component'
  ;
import {InventoryMaintenanceManagerComponent} from './inventory-maintenance-manager/inventory-maintenance-manager.component'
  ;
import {InterruptionManagerComponent} from './interruption-manager/interruption-manager.component';
import {NgxChartsModule} from "@swimlane/ngx-charts";


import {MaintenanceManagerComponent} from './maintenance-manager/maintenance-manager.component'
  ;
import {AlertDetentionComponent} from './alert-detention/alert-detention.component'
  ;


import {ProductionInputComponent} from './production-input/production-input.component'
  ;
import {AddProductionManagerComponent} from './add-production-manager/add-production-manager.component';
import {MatRadioModule} from '@angular/material/radio';

;
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ProductTurnManagerComponent} from './product-turn-manager/product-turn-manager.component';
import {ProductionManagerComponent} from './production-manager/production-manager.component';
import {VelocidadManagerComponent} from './velocidad-manager/velocidad-manager.component';
import {MermasManagerComponent} from './mermas-manager/mermas-manager.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {SelectAlertDetentionComponent} from './select-alert-detention/select-alert-detention.component';
import {VistaEmpresaComponent} from './vista-empresa/vista-empresa.component';
import {AjustesEmpresaManagerComponent} from './ajustes-empresa-manager/ajustes-empresa-manager.component'
import {SchedulerComponent} from './scheduler/scheduler.component'
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatExpansionModule} from '@angular/material/expansion';
import {GaugeModule} from 'angular-gauge';
import {ReportesComponent} from './reportes/reportes.component'
import {TurnSelectorManagerComponent} from './turn-selector-manager/turn-selector-manager.component'
import {MiLoaderComponent} from './mi-loader/mi-loader.component'
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import {IndicadorComponent} from './indicador/indicador.component'
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {DonaChartComponent} from './dona-chart/dona-chart.component'
import {BarraEventosComponent} from './barra-eventos/barra-eventos.component'
import {TablaReportesComponent} from './tabla-reportes/tabla-reportes.component'
import {CuadroInfoReportesComponent} from './cuadro-info-reportes/cuadro-info-reportes.component'
import {HorizonChartComponent} from './horizon-chart/horizon-chart.component'
import {RealLineChartComponent} from './real-line-chart/real-line-chart.component';
import {DetalleSchedulerComponent} from './detalle-scheduler/detalle-scheduler.component'
import {IndicadorVistaEmpresaComponent} from './indicador-vista-empresa/indicador-vista-empresa.component'
import {PlanillaDetentionManagerComponent} from './planilla-detention-manager/planilla-detention-manager.component'
import {PlanillaSubproductManagerComponent} from './planilla-subproduct-manager/planilla-subproduct-manager.component'
import {DetalleSchedulerDataSensorComponent} from './detalle-scheduler-data-sensor/detalle-scheduler-data-sensor.component'
import {VistaOtComponent} from './vista-ot/vista-ot.component'
import {CategoriaSensorComponent} from './categoria-sensor/categoria-sensor.component'
import {SensorManagerComponent} from "@app/events/sensor/sensor-manager/sensor-manager.component"
import {SensorDataTableComponent} from "@app/events/sensor/sensor-data-table/sensor-data-table.component"
import {SensorRegisterComponent} from './sensor-register/sensor-register.component'
import {InfoSensorRegisteredComponent} from './info-sensor-registered/info-sensor-registered.component'
import {BtnCerrarModalComponent} from './btn-cerrar-modal/btn-cerrar-modal.component'
import {MachineSensorManagerComponent} from './machine-sensor-manager/machine-sensor-manager.component'
import {OrdendeTrabajoManagerComponent} from './ordende-trabajo-manager/ordende-trabajo-manager.component'
import {ShowOTComponent} from './show-ot/show-ot.component'
import {DetalleSchedulerInfoProdComponent} from './detalle-scheduler-info-prod/detalle-scheduler-info-prod.component'
import {OrdendetrabajoSumarProdComponent} from './ordendetrabajo-sumar-prod/ordendetrabajo-sumar-prod.component'
import {ComentariootManagerComponent} from './comentarioot-manager/comentarioot-manager.component'
import {VerMantencionComponent} from './ver-mantencion/ver-mantencion.component'
import {VerInterrupcionComponent} from './ver-interrupcion/ver-interrupcion.component'
import {PlanillaOrdendetrabajo} from "@app/planilla-ordendetrabajo-manager/planilla-ordendetrabajo-manager.component";
import {BasicMenuComponent} from './basic-menu/basic-menu.component'
import {AsociarOrdenTurnoPasadoComponent} from './asociar-orden-turno-pasado/asociar-orden-turno-pasado.component'
import {OTCardComponent} from './otcard/otcard.component'
import {ReportesPlanillasComponent} from './reportes-planillas/reportes-planillas.component'
import {ReportesPlanillaProductosComponent} from './reportes-planilla-productos/reportes-planilla-productos.component';

import {Angular2CsvModule} from "angular2-csv";
import {NewInterruptionDurationComponent} from './new-interruption-duration/new-interruption-duration.component'
  ;
import {QrUserComponent} from './qr-user/qr-user.component'
  ;
import {QrOrdendeTrabajoComponent} from './qr-ordende-trabajo/qr-ordende-trabajo.component';
import {QrMaquinaComponent} from './qr-maquina/qr-maquina.component'

import {QRCodeModule} from 'angularx-qrcode';
import {PrintBotonComponent} from './print-boton/print-boton.component'
  ;
import {NotificacionesViewerComponent} from './notificaciones-viewer/notificaciones-viewer.component'
  ;
import {NotifySuscriptionsManagerComponent} from './notify-suscriptions-manager/notify-suscriptions-manager.component'
  ;
import {NotificacionEmergenteComponent} from './notificacion-emergente/notificacion-emergente.component'
  ;
import {QrMantencionesComponent} from './qr-mantenciones/qr-mantenciones.component'
  ;
import {MachineMaintenancesManagerComponent} from './machine-maintenances-manager/machine-maintenances-manager.component'
  ;
import {MaquinasMantCreatorComponent} from './maquinas-mant-creator/maquinas-mant-creator.component'
  ;
import {GrupoNotManagerComponent} from './grupo-not-manager/grupo-not-manager.component';
import {GrupoNotCreatorComponent} from './grupo-not-creator/grupo-not-creator.component'
import {NgxTimeSchedulerModule} from "ngx-time-scheduler-mes-software";
import {PlanificadorVistaComponent} from "@app/planificador-vista/planificador-vista.component";
import {NgCircleProgressModule} from 'ng-circle-progress';
import {InfoEventTsComponent} from './info-event-ts/info-event-ts.component'
import {PlanificadorParadaCreatorComponent} from './planificador-parada-creator/planificador-parada-creator.component'
import {HorariosManagerComponent} from './horarios-manager/horarios-manager.component'
  ;
import {ProgresoChartComponent} from './progreso-chart/progreso-chart.component'
  ;
import {OtProgressComponent} from './ot-progress/ot-progress.component'
import {MermaDataTableComponent} from "@app/events/merma/merma-data-table/merma-data-table.component";
import {MermaManagerComponent} from "@app/events/merma/merma-manager/merma-manager.component";

;
import {CreateTipoMermaOtManagerComponent} from './create-tipo-merma-ot-manager/create-tipo-merma-ot-manager.component'
  ;
import {MonitoreoComponent} from './monitoreo/monitoreo.component'
  ;
import {AnaliticaComponent} from './analitica/analitica.component'
  ;
import {FiltroNormieComponent} from './filtro-normie/filtro-normie.component'
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  imports: [
    AppRoutingModule,
    //NgxTimeSchedulerResizeModule,
    NgxTimeSchedulerModule,
    NgxMatSelectSearchModule,
    AgGridModule.withComponents([]),

    ChartModule,
    GaugeModule.forRoot(),
    QRCodeModule,
    MatExpansionModule,
    NgxChartsModule,
    BrowserModule,
    Angular2CsvModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTooltipModule,
    HttpClientModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatPaginatorModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300

    }),
    MatBadgeModule,
    MatAutocompleteModule,
    //NgxTimeSchedulerModule,
    MatToolbarModule,
    MatTableModule,
    MatRadioModule,
    MatChipsModule,
    MatDialogModule,
    MatListModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatProgressBarModule,
    BrowserAnimationsModule,
    MatIconModule,
  ],
  declarations: [
    MaquinaComponent,
    AppComponent,
    HomeComponent,
    LoginComponent,
    MaquinalabelkpisComponent,
    MaquinalabelconfigComponent,
    AgregarMaquinaComponent,
    ListItemComponent,
    DataManagerComponent,
    UsersManagerComponent,
    PlantManagerComponent,
    SensorManagerComponent,
    SensorDataTableComponent,
    SubProductManagerComponent,
    MaintenanceManagerComponent,
    MachineManagerComponent,
    UserDataTableComponent,
    ProcessManagerComponent,
    ProductManagerComponent,
    InventoryManagerComponent,
    PlanificadorVistaComponent,
    MermaDataTableComponent,
    MermaManagerComponent,
    MachineDataTableComponent,
    PlantDataTableComponent,
    SubProductDataTableComponent,
    ProcessDataTableComponent,
    InventoryDataTableComponent,
    ProductDataTableComponent,
    CategoryDetentionDataTableComponent,
    CategoryDetentionDataManagerComponent,
    SelectedMachineComponent,
    MachineSelectionComponent,
    ProcessSelectionComponent,
    PlantSelectionComponent,
    ErrorFormComponent,
    MachineDetentionsManagerComponent,
    MachineProductsManagerComponent,
    MantencionesComponent,
    InterrupcionesComponent,
    OeeComponent,
    MachineTurnManagerComponent,
    InmersiveTurnComponent,
    MensajesComponent,
    AlertasComponent,
    InventoryMaintenanceManagerComponent,
    InterruptionManagerComponent,
    AlertDetentionComponent,
    ProductionInputComponent,
    AddProductionManagerComponent,
    ProductTurnManagerComponent,
    ProductionManagerComponent,
    VelocidadManagerComponent,
    MermasManagerComponent,
    SelectAlertDetentionComponent,
    VistaEmpresaComponent,
    AjustesEmpresaManagerComponent,
    SchedulerComponent,
    ReportesComponent,
    TurnSelectorManagerComponent,
    MiLoaderComponent,
    IndicadorComponent,
    DonaChartComponent,
    BarraEventosComponent,
    TablaReportesComponent,
    CuadroInfoReportesComponent,
    RealLineChartComponent,
    DetalleSchedulerComponent,
    HorizonChartComponent,
    IndicadorVistaEmpresaComponent,
    PlanillaDetentionManagerComponent,
    PlanillaSubproductManagerComponent,
    PlanillaOrdendetrabajo,
    DetalleSchedulerDataSensorComponent,
    VistaOtComponent,
    CategoriaSensorComponent
    ,
    SensorRegisterComponent,
    InfoSensorRegisteredComponent,
    BtnCerrarModalComponent,
    MachineSensorManagerComponent,
    OrdendeTrabajoManagerComponent,
    ShowOTComponent,
    DetalleSchedulerInfoProdComponent,
    OrdendetrabajoSumarProdComponent,
    ComentariootManagerComponent,
    VerMantencionComponent,
    VerInterrupcionComponent,
    BasicMenuComponent,
    AsociarOrdenTurnoPasadoComponent,
    OTCardComponent,
    ReportesPlanillasComponent,
    ReportesPlanillaProductosComponent,
    NewInterruptionDurationComponent,
    QrUserComponent,
    QrOrdendeTrabajoComponent,
    QrMaquinaComponent,
    PrintBotonComponent,
    NotifySuscriptionsManagerComponent,
    NotificacionEmergenteComponent,
    NotificacionesViewerComponent,
    QrMantencionesComponent
    ,
    MachineMaintenancesManagerComponent,
    MaquinasMantCreatorComponent,
    GrupoNotCreatorComponent,
    InfoEventTsComponent,
    PlanificadorParadaCreatorComponent,
    HorariosManagerComponent,
    GrupoNotManagerComponent,
    FiltroNormieComponent,
    ProgresoChartComponent,
    OtProgressComponent,
    CreateTipoMermaOtManagerComponent,
    MonitoreoComponent,
    AnaliticaComponent

  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: MAT_DIALOG_DATA, useValue: {}},
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: LOCALE_ID, useValue: 'es'},
    {provide: HIGHCHARTS_MODULES, useFactory: () => [pareto]},
    Alerts

    // provider used to create fake backend
    //fakeBackendProvider
  ],
  bootstrap: [AppComponent],
  exports: [
    MatFormFieldModule, MatInputModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})

export class AppModule {
}
