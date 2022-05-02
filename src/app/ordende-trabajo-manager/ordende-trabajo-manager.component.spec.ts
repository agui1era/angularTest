import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdendeTrabajoManagerComponent } from './ordende-trabajo-manager.component';

describe('OrdendeTrabajoManagerComponent', () => {
  let component: OrdendeTrabajoManagerComponent;
  let fixture: ComponentFixture<OrdendeTrabajoManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdendeTrabajoManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdendeTrabajoManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
