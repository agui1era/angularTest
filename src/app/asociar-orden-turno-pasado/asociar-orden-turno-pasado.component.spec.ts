import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsociarOrdenTurnoPasadoComponent } from './asociar-orden-turno-pasado.component';

describe('AsociarOrdenTurnoPasadoComponent', () => {
  let component: AsociarOrdenTurnoPasadoComponent;
  let fixture: ComponentFixture<AsociarOrdenTurnoPasadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsociarOrdenTurnoPasadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsociarOrdenTurnoPasadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
