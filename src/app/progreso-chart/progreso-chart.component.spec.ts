import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgresoChartComponent } from './progreso-chart.component';

describe('ProgresoChartComponent', () => {
  let component: ProgresoChartComponent;
  let fixture: ComponentFixture<ProgresoChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgresoChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgresoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
