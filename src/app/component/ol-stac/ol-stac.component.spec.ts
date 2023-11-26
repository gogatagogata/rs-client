import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlStacComponent } from './ol-stac.component';

describe('OlStacComponent', () => {
  let component: OlStacComponent;
  let fixture: ComponentFixture<OlStacComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OlStacComponent]
    });
    fixture = TestBed.createComponent(OlStacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
