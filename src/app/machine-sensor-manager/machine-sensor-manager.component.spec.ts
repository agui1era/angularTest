import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineSensorManagerComponent } from './machine-sensor-manager.component';

describe('MachineSensorManagerComponent', () => {
  let component: MachineSensorManagerComponent;
  let fixture: ComponentFixture<MachineSensorManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineSensorManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineSensorManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
