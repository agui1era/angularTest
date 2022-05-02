import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionInputComponent } from './production-input.component';

describe('ProductionInputComponent', () => {
  let component: ProductionInputComponent;
  let fixture: ComponentFixture<ProductionInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
