import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSchedulerDataSensorComponent } from './detalle-scheduler-data-sensor.component';

describe('DetalleSchedulerDataSensorComponent', () => {
  let component: DetalleSchedulerDataSensorComponent;
  let fixture: ComponentFixture<DetalleSchedulerDataSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleSchedulerDataSensorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleSchedulerDataSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
