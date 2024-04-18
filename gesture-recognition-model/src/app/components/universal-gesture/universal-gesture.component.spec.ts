import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalGestureComponent } from './universal-gesture.component';

describe('UniversalGestureComponent', () => {
  let component: UniversalGestureComponent;
  let fixture: ComponentFixture<UniversalGestureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniversalGestureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversalGestureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
