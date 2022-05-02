import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrMantencionesComponent } from './qr-mantenciones.component';

describe('QrMantencionesComponent', () => {
  let component: QrMantencionesComponent;
  let fixture: ComponentFixture<QrMantencionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrMantencionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrMantencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
