import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizonChartComponent } from './horizon-chart.component';

describe('HorizonChartComponent', () => {
  let component: HorizonChartComponent;
  let fixture: ComponentFixture<HorizonChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorizonChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizonChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
