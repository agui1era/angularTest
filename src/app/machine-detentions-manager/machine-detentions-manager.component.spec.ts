import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineDetentionsManagerComponent } from './machine-detentions-manager.component';

describe('MachineDetentionsManagerComponent', () => {
  let component: MachineDetentionsManagerComponent;
  let fixture: ComponentFixture<MachineDetentionsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineDetentionsManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineDetentionsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
