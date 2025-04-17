import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultHomeComponent } from './default-home.component';

describe('DefaultHomeComponent', () => {
  let component: DefaultHomeComponent;
  let fixture: ComponentFixture<DefaultHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
