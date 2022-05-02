import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificadorVistaComponent } from './planificador-vista.component';

describe('PlanificadorVistaComponent', () => {
  let component: PlanificadorVistaComponent;
  let fixture: ComponentFixture<PlanificadorVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanificadorVistaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanificadorVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
