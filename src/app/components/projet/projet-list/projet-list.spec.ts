import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetList } from './projet-list';

describe('ProjetList', () => {
  let component: ProjetList;
  let fixture: ComponentFixture<ProjetList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
