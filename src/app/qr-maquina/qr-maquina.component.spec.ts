import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrMaquinaComponent } from './qr-maquina.component';

describe('QrMaquinaComponent', () => {
  let component: QrMaquinaComponent;
  let fixture: ComponentFixture<QrMaquinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrMaquinaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrMaquinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
