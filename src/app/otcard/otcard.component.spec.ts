import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTCardComponent } from './otcard.component';

describe('OTCardComponent', () => {
  let component: OTCardComponent;
  let fixture: ComponentFixture<OTCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OTCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OTCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
