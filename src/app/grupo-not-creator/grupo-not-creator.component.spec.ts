import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoNotCreatorComponent } from './grupo-not-creator.component';

describe('GrupoNotCreatorComponent', () => {
  let component: GrupoNotCreatorComponent;
  let fixture: ComponentFixture<GrupoNotCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrupoNotCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoNotCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
