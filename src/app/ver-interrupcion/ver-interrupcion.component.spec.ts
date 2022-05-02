import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerInterrupcionComponent } from './ver-interrupcion.component';

describe('VerInterrupcionComponent', () => {
  let component: VerInterrupcionComponent;
  let fixture: ComponentFixture<VerInterrupcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerInterrupcionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerInterrupcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
