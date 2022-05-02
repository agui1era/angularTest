import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquinasMantCreatorComponent } from './maquinas-mant-creator.component';

describe('MaquinasMantCreatorComponent', () => {
  let component: MaquinasMantCreatorComponent;
  let fixture: ComponentFixture<MaquinasMantCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaquinasMantCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaquinasMantCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
