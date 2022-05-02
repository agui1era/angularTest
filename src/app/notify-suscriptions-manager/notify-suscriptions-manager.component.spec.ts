import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifySuscriptionsManagerComponent } from './notify-suscriptions-manager.component';

describe('NotifySuscriptionsManagerComponent', () => {
  let component: NotifySuscriptionsManagerComponent;
  let fixture: ComponentFixture<NotifySuscriptionsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifySuscriptionsManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifySuscriptionsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
