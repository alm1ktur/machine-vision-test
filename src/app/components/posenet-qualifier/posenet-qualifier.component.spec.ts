import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosenetQualifierComponent } from './posenet-qualifier.component';

describe('PosenetQualifierComponent', () => {
  let component: PosenetQualifierComponent;
  let fixture: ComponentFixture<PosenetQualifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosenetQualifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosenetQualifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
