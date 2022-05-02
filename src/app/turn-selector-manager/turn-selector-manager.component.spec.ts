import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnSelectorManagerComponent } from './turn-selector-manager.component';

describe('TurnSelectorManagerComponent', () => {
  let component: TurnSelectorManagerComponent;
  let fixture: ComponentFixture<TurnSelectorManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnSelectorManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnSelectorManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
