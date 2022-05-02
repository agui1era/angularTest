import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesViewerComponent } from './notificaciones-viewer.component';

describe('NotificacionesViewerComponent', () => {
  let component: NotificacionesViewerComponent;
  let fixture: ComponentFixture<NotificacionesViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificacionesViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionesViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
