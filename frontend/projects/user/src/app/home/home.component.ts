import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
