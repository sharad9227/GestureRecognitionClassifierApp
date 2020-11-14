import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonVideoComponent } from './common-video.component';

describe('CommonVideoComponent', () => {
  let component: CommonVideoComponent;
  let fixture: ComponentFixture<CommonVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
