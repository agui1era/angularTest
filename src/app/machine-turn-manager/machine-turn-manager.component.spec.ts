import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineTurnManagerComponent } from './machine-turn-manager.component';

describe('MachineTurnManagerComponent', () => {
  let component: MachineTurnManagerComponent;
  let fixture: ComponentFixture<MachineTurnManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineTurnManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineTurnManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
