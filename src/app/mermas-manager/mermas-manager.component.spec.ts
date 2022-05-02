import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MermasManagerComponent } from './mermas-manager.component';

describe('MermasManagerComponent', () => {
  let component: MermasManagerComponent;
  let fixture: ComponentFixture<MermasManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MermasManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MermasManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
