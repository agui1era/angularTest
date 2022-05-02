import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiLoaderComponent } from './mi-loader.component';

describe('MiLoaderComponent', () => {
  let component: MiLoaderComponent;
  let fixture: ComponentFixture<MiLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
