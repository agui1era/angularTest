import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VelocidadManagerComponent } from './velocidad-manager.component';

describe('VelocidadManagerComponent', () => {
  let component: VelocidadManagerComponent;
  let fixture: ComponentFixture<VelocidadManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VelocidadManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VelocidadManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
