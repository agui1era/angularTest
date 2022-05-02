import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineSelectionComponent } from './machine-selection.component';

describe('MachineSelectionComponent', () => {
  let component: MachineSelectionComponent;
  let fixture: ComponentFixture<MachineSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
