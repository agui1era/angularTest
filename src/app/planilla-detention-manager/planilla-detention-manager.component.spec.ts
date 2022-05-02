import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaDetentionManagerComponent } from './planilla-detention-manager.component';

describe('PlanillaDetentionManagerComponent', () => {
  let component: PlanillaDetentionManagerComponent;
  let fixture: ComponentFixture<PlanillaDetentionManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanillaDetentionManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanillaDetentionManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
