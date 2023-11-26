import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentinelProcessApiComponent } from './sentinel-process-api.component';

describe('SentinelProcessApiComponent', () => {
  let component: SentinelProcessApiComponent;
  let fixture: ComponentFixture<SentinelProcessApiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SentinelProcessApiComponent]
    });
    fixture = TestBed.createComponent(SentinelProcessApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
