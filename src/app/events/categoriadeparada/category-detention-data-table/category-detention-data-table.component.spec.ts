import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDetentionDataTableComponent } from './category-detention-data-table.component';

describe('CategoryDetentionDataTableComponent', () => {
  let component: CategoryDetentionDataTableComponent;
  let fixture: ComponentFixture<CategoryDetentionDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryDetentionDataTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryDetentionDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
