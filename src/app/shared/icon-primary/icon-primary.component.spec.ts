import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconPrimaryComponent } from './icon-primary.component';

describe('IconPrimaryComponent', () => {
  let component: IconPrimaryComponent;
  let fixture: ComponentFixture<IconPrimaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconPrimaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconPrimaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
