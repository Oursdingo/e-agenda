import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app'; // ← corrige ici

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent], // ← et ici
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent); // ← ici aussi
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});