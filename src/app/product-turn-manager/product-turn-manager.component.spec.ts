import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTurnManagerComponent } from './product-turn-manager.component';

describe('ProductTurnManagerComponent', () => {
  let component: ProductTurnManagerComponent;
  let fixture: ComponentFixture<ProductTurnManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTurnManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTurnManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
