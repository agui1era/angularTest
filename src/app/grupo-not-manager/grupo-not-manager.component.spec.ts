import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoNotManagerComponent } from './grupo-not-manager.component';

describe('GrupoNotManagerComponent', () => {
  let component: GrupoNotManagerComponent;
  let fixture: ComponentFixture<GrupoNotManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrupoNotManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoNotManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
