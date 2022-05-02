import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDataTableComponent } from './inventory-data-table.component';

describe('InventoryDataTableComponent', () => {
  let component: InventoryDataTableComponent;
  let fixture: ComponentFixture<InventoryDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryDataTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
