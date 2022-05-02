import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificadorParadaCreatorComponent } from './planificador-parada-creator.component';

describe('PlanificadorParadaCreatorComponent', () => {
  let component: PlanificadorParadaCreatorComponent;
  let fixture: ComponentFixture<PlanificadorParadaCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanificadorParadaCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanificadorParadaCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
