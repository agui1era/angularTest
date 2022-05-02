import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdendetrabajoSumarProdComponent } from './ordendetrabajo-sumar-prod.component';

describe('OrdendetrabajoSumarProdComponent', () => {
  let component: OrdendetrabajoSumarProdComponent;
  let fixture: ComponentFixture<OrdendetrabajoSumarProdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdendetrabajoSumarProdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdendetrabajoSumarProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
