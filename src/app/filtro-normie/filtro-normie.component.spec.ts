import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroNormieComponent } from './filtro-normie.component';

describe('FiltroNormieComponent', () => {
  let component: FiltroNormieComponent;
  let fixture: ComponentFixture<FiltroNormieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltroNormieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroNormieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
