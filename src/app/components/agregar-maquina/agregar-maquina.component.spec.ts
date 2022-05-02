import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarMaquinaComponent } from './agregar-maquina.component';

describe('AgregarMaquinaComponent', () => {
  let component: AgregarMaquinaComponent;
  let fixture: ComponentFixture<AgregarMaquinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarMaquinaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarMaquinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
