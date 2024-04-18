import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutedSuccessComponent } from './routed-success.component';

describe('RoutedSuccessComponent', () => {
  let component: RoutedSuccessComponent;
  let fixture: ComponentFixture<RoutedSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutedSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutedSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
