import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineDataTableComponent } from './machine-data-table.component';

describe('MachineDataTableComponent', () => {
  let component: MachineDataTableComponent;
  let fixture: ComponentFixture<MachineDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineDataTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
