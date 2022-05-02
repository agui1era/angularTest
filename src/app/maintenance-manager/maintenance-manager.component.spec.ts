import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceManagerComponent } from './maintenance-manager.component';

describe('MaintenanceManagerComponent', () => {
  let component: MaintenanceManagerComponent;
  let fixture: ComponentFixture<MaintenanceManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
