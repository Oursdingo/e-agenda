import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaborateurList } from './collaborateur-list';

describe('CollaborateurList', () => {
  let component: CollaborateurList;
  let fixture: ComponentFixture<CollaborateurList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollaborateurList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollaborateurList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
