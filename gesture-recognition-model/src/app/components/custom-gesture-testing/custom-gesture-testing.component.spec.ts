import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomGestureTestingComponent } from './custom-gesture-testing.component';

describe('CustomGestureTestingComponent', () => {
  let component: CustomGestureTestingComponent;
  let fixture: ComponentFixture<CustomGestureTestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomGestureTestingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomGestureTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
