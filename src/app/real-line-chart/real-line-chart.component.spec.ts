import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealLineChartComponent } from './real-line-chart.component';

describe('RealLineChartComponent', () => {
  let component: RealLineChartComponent;
  let fixture: ComponentFixture<RealLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealLineChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
