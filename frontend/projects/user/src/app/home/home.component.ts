import { Component } from '@angular/core';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { TrendingBooksComponent } from './trending-books/trending-books.component';
import { AboutSectionComponent } from './about-section/about-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroSectionComponent,
    TrendingBooksComponent,
    AboutSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
