import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentariootManagerComponent } from './comentarioot-manager.component';

describe('ComentariootManagerComponent', () => {
  let component: ComentariootManagerComponent;
  let fixture: ComponentFixture<ComentariootManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComentariootManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComentariootManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
