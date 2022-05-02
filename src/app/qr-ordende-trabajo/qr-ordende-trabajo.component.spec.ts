import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrOrdendeTrabajoComponent } from './qr-ordende-trabajo.component';

describe('QrOrdendeTrabajoComponent', () => {
  let component: QrOrdendeTrabajoComponent;
  let fixture: ComponentFixture<QrOrdendeTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrOrdendeTrabajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrOrdendeTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
