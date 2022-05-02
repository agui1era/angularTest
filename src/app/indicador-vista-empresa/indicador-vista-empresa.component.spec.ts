import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadorVistaEmpresaComponent } from './indicador-vista-empresa.component';

describe('IndicadorVistaEmpresaComponent', () => {
  let component: IndicadorVistaEmpresaComponent;
  let fixture: ComponentFixture<IndicadorVistaEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicadorVistaEmpresaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadorVistaEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
