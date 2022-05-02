import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantencionesComponent } from './mantenciones.component';

describe('MantencionesComponent', () => {
  let component: MantencionesComponent;
  let fixture: ComponentFixture<MantencionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantencionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
