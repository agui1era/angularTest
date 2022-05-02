import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaSensorComponent } from './categoria-sensor.component';

describe('CategoriaSensorComponent', () => {
  let component: CategoriaSensorComponent;
  let fixture: ComponentFixture<CategoriaSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriaSensorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
