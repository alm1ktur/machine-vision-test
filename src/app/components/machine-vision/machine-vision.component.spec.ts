import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineVisionComponent } from './machine-vision.component';

describe('MachineVisionComponent', () => {
  let component: MachineVisionComponent;
  let fixture: ComponentFixture<MachineVisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineVisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineVisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
