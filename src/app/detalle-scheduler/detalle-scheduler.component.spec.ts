import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSchedulerComponent } from './detalle-scheduler.component';

describe('DetalleSchedulerComponent', () => {
  let component: DetalleSchedulerComponent;
  let fixture: ComponentFixture<DetalleSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleSchedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
