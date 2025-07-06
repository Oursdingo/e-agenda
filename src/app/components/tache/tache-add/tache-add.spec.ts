import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacheAdd } from './tache-add';

describe('TacheAdd', () => {
  let component: TacheAdd;
  let fixture: ComponentFixture<TacheAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TacheAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TacheAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
