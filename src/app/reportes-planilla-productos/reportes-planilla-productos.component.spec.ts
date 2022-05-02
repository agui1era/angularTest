import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesPlanillaProductosComponent } from './reportes-planilla-productos.component';

describe('ReportesPlanillaProductosComponent', () => {
  let component: ReportesPlanillaProductosComponent;
  let fixture: ComponentFixture<ReportesPlanillaProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesPlanillaProductosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesPlanillaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
