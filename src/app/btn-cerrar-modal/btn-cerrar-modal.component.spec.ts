import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnCerrarModalComponent } from './btn-cerrar-modal.component';

describe('BtnCerrarModalComponent', () => {
  let component: BtnCerrarModalComponent;
  let fixture: ComponentFixture<BtnCerrarModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnCerrarModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnCerrarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
