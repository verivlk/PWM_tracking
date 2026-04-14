import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingItem } from './setting-item';

describe('SettingItem', () => {
  let component: SettingItem;
  let fixture: ComponentFixture<SettingItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingItem],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
