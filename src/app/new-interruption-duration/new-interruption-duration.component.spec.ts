import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInterruptionDurationComponent } from './new-interruption-duration.component';

describe('NewInterruptionDurationComponent', () => {
  let component: NewInterruptionDurationComponent;
  let fixture: ComponentFixture<NewInterruptionDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewInterruptionDurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewInterruptionDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
