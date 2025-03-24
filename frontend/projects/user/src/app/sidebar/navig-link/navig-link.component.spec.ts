import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigLinkComponent } from './navig-link.component';

describe('NavigLinkComponent', () => {
  let component: NavigLinkComponent;
  let fixture: ComponentFixture<NavigLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
