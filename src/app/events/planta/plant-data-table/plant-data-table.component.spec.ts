import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantDataTableComponent } from './plant-data-table.component';

describe('PlantDataTableComponent', () => {
  let component: PlantDataTableComponent;
  let fixture: ComponentFixture<PlantDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantDataTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
