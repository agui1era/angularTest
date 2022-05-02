import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDetentionDataManagerComponent } from './category-detention-data-manager.component';

describe('CategoryDetentionDataManagerComponent', () => {
  let component: CategoryDetentionDataManagerComponent;
  let fixture: ComponentFixture<CategoryDetentionDataManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryDetentionDataManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryDetentionDataManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
