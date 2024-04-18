import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomGestureComponent } from './custom-gesture.component';

describe('CustomGestureComponent', () => {
  let component: CustomGestureComponent;
  let fixture: ComponentFixture<CustomGestureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomGestureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomGestureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
