import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoEventTsComponent } from './info-event-ts.component';

describe('InfoEventTsComponent', () => {
  let component: InfoEventTsComponent;
  let fixture: ComponentFixture<InfoEventTsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoEventTsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoEventTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
