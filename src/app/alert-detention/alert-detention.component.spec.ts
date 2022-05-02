import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDetentionComponent } from './alert-detention.component';

describe('AlertDetentionComponent', () => {
  let component: AlertDetentionComponent;
  let fixture: ComponentFixture<AlertDetentionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertDetentionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDetentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
