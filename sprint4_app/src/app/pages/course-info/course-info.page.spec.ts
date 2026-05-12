import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseInfoPage } from './course-info.page';

describe('CourseInfoPage', () => {
  let component: CourseInfoPage;
  let fixture: ComponentFixture<CourseInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
