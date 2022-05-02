import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonaChartComponent } from './dona-chart.component';

describe('DonaChartComponent', () => {
  let component: DonaChartComponent;
  let fixture: ComponentFixture<DonaChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonaChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
