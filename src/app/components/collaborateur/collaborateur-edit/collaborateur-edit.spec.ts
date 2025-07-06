import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaborateurEdit } from './collaborateur-edit';

describe('CollaborateurEdit', () => {
  let component: CollaborateurEdit;
  let fixture: ComponentFixture<CollaborateurEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollaborateurEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollaborateurEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
