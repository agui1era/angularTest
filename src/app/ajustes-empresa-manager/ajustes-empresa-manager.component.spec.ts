import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjustesEmpresaManagerComponent } from './ajustes-empresa-manager.component';

describe('AjustesEmpresaManagerComponent', () => {
  let component: AjustesEmpresaManagerComponent;
  let fixture: ComponentFixture<AjustesEmpresaManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjustesEmpresaManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjustesEmpresaManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
