import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquinalabelkpisComponent } from './maquinalabelkpis.component';

describe('MaquinalabelkpisComponent', () => {
  let component: MaquinalabelkpisComponent;
  let fixture: ComponentFixture<MaquinalabelkpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaquinalabelkpisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaquinalabelkpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
