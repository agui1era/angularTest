import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineManagerComponent } from './machine-manager.component';

describe('MachineManagerComponent', () => {
  let component: MachineManagerComponent;
  let fixture: ComponentFixture<MachineManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
