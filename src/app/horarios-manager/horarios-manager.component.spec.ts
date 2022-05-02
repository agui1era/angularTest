import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariosManagerComponent } from './horarios-manager.component';

describe('HorariosManagerComponent', () => {
  let component: HorariosManagerComponent;
  let fixture: ComponentFixture<HorariosManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorariosManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorariosManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
