import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAlertDetentionComponent } from './select-alert-detention.component';

describe('SelectAlertDetentionComponent', () => {
  let component: SelectAlertDetentionComponent;
  let fixture: ComponentFixture<SelectAlertDetentionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectAlertDetentionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAlertDetentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
