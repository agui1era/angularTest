import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineMaintenancesManagerComponent } from './machine-maintenances-manager.component';

describe('MachineMaintenancesManagerComponent', () => {
  let component: MachineMaintenancesManagerComponent;
  let fixture: ComponentFixture<MachineMaintenancesManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineMaintenancesManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineMaintenancesManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
