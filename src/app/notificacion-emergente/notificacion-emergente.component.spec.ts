import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionEmergenteComponent } from './notificacion-emergente.component';

describe('NotificacionEmergenteComponent', () => {
  let component: NotificacionEmergenteComponent;
  let fixture: ComponentFixture<NotificacionEmergenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificacionEmergenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionEmergenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
