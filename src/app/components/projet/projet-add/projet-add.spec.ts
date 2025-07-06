import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetAdd } from './projet-add';

describe('ProjetAdd', () => {
  let component: ProjetAdd;
  let fixture: ComponentFixture<ProjetAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
