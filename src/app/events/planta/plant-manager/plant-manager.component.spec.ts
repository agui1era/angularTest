import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantManagerComponent } from './plant-manager.component';

describe('PlantManagerComponent', () => {
  let component: PlantManagerComponent;
  let fixture: ComponentFixture<PlantManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
