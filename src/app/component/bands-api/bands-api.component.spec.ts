import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandsApiComponent } from './bands-api.component';

describe('BandsApiComponent', () => {
  let component: BandsApiComponent;
  let fixture: ComponentFixture<BandsApiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BandsApiComponent]
    });
    fixture = TestBed.createComponent(BandsApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
