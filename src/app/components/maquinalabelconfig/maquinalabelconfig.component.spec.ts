import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquinalabelconfigComponent } from './maquinalabelconfig.component';

describe('MaquinalabelconfigComponent', () => {
  let component: MaquinalabelconfigComponent;
  let fixture: ComponentFixture<MaquinalabelconfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaquinalabelconfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaquinalabelconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
