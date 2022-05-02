import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMaintenanceManagerComponent } from './inventory-maintenance-manager.component';

describe('InventoryMaintenanceManagerComponent', () => {
  let component: InventoryMaintenanceManagerComponent;
  let fixture: ComponentFixture<InventoryMaintenanceManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryMaintenanceManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryMaintenanceManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
