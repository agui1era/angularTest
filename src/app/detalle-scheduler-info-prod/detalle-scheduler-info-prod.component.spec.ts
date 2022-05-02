import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSchedulerInfoProdComponent } from './detalle-scheduler-info-prod.component';

describe('DetalleSchedulerInfoProdComponent', () => {
  let component: DetalleSchedulerInfoProdComponent;
  let fixture: ComponentFixture<DetalleSchedulerInfoProdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleSchedulerInfoProdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleSchedulerInfoProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
