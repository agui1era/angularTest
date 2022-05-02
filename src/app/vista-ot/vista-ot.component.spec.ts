import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaOtComponent } from './vista-ot.component';

describe('VistaOtComponent', () => {
  let component: VistaOtComponent;
  let fixture: ComponentFixture<VistaOtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaOtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaOtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
