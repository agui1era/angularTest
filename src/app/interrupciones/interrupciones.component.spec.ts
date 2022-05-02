import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterrupcionesComponent } from './interrupciones.component';

describe('InterrupcionesComponent', () => {
  let component: InterrupcionesComponent;
  let fixture: ComponentFixture<InterrupcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterrupcionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterrupcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
