import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowOTComponent } from './show-ot.component';

describe('ShowOTComponent', () => {
  let component: ShowOTComponent;
  let fixture: ComponentFixture<ShowOTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowOTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowOTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
