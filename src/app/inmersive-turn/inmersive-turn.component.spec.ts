import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InmersiveTurnComponent } from './inmersive-turn.component';

describe('InmersiveTurnComponent', () => {
  let component: InmersiveTurnComponent;
  let fixture: ComponentFixture<InmersiveTurnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InmersiveTurnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InmersiveTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
