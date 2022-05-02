import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductionManagerComponent } from './add-production-manager.component';

describe('AddProductionManagerComponent', () => {
  let component: AddProductionManagerComponent;
  let fixture: ComponentFixture<AddProductionManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductionManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductionManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
