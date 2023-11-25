import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandsOdataComponent } from './bands-odata.component';

describe('BandsOdataComponent', () => {
  let component: BandsOdataComponent;
  let fixture: ComponentFixture<BandsOdataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BandsOdataComponent]
    });
    fixture = TestBed.createComponent(BandsOdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
