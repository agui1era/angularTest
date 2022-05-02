import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadroInfoReportesComponent } from './cuadro-info-reportes.component';

describe('CuadroInfoReportesComponent', () => {
  let component: CuadroInfoReportesComponent;
  let fixture: ComponentFixture<CuadroInfoReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuadroInfoReportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuadroInfoReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
