import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterruptionManagerComponent } from './interruption-manager.component';

describe('InterruptionManagerComponent', () => {
  let component: InterruptionManagerComponent;
  let fixture: ComponentFixture<InterruptionManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterruptionManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterruptionManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
