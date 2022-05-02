import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineProductsManagerComponent } from './machine-products-manager.component';

describe('MachineProductsManagerComponent', () => {
  let component: MachineProductsManagerComponent;
  let fixture: ComponentFixture<MachineProductsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineProductsManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineProductsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
