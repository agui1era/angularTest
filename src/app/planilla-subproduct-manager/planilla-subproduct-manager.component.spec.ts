import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaSubproductManagerComponent } from './planilla-subproduct-manager.component';

describe('PlanillaSubproductManagerComponent', () => {
  let component: PlanillaSubproductManagerComponent;
  let fixture: ComponentFixture<PlanillaSubproductManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanillaSubproductManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanillaSubproductManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
