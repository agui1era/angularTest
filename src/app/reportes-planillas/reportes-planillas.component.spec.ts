import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesPlanillasComponent } from './reportes-planillas.component';

describe('ReportesPlanillasComponent', () => {
  let component: ReportesPlanillasComponent;
  let fixture: ComponentFixture<ReportesPlanillasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesPlanillasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesPlanillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
