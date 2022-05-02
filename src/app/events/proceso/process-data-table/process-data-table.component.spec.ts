import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessDataTableComponent } from './process-data-table.component';

describe('ProcessDataTableComponent', () => {
  let component: ProcessDataTableComponent;
  let fixture: ComponentFixture<ProcessDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessDataTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
