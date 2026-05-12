import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesDashboardPage } from './courses-dashboard.page';

describe('CoursesDashboardPage', () => {
  let component: CoursesDashboardPage;
  let fixture: ComponentFixture<CoursesDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
