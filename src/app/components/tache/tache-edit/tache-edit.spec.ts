import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacheEdit } from './tache-edit';

describe('TacheEdit', () => {
  let component: TacheEdit;
  let fixture: ComponentFixture<TacheEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TacheEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TacheEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
