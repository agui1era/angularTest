import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTipoMermaOtManagerComponent } from './create-tipo-merma-ot-manager.component';

describe('CreateTipoMermaOtManagerComponent', () => {
  let component: CreateTipoMermaOtManagerComponent;
  let fixture: ComponentFixture<CreateTipoMermaOtManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTipoMermaOtManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTipoMermaOtManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
