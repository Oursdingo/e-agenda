import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaborateurAdd } from './collaborateur-add';

describe('CollaborateurAdd', () => {
  let component: CollaborateurAdd;
  let fixture: ComponentFixture<CollaborateurAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollaborateurAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollaborateurAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
