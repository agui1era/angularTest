import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSensorRegisteredComponent } from './info-sensor-registered.component';

describe('InfoSensorRegisteredComponent', () => {
  let component: InfoSensorRegisteredComponent;
  let fixture: ComponentFixture<InfoSensorRegisteredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoSensorRegisteredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSensorRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
