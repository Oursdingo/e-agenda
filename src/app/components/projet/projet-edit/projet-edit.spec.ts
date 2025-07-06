import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetEdit } from './projet-edit';

describe('ProjetEdit', () => {
  let component: ProjetEdit;
  let fixture: ComponentFixture<ProjetEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
