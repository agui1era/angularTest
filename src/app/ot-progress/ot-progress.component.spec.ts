import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtProgressComponent } from './ot-progress.component';

describe('OtProgressComponent', () => {
  let component: OtProgressComponent;
  let fixture: ComponentFixture<OtProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
