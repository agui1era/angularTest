import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBotonComponent } from './print-boton.component';

describe('PrintBotonComponent', () => {
  let component: PrintBotonComponent;
  let fixture: ComponentFixture<PrintBotonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintBotonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintBotonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
