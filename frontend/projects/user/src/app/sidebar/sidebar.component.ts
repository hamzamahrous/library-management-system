import { Component, HostListener, OnInit } from '@angular/core';
import { LogoComponent } from '../../../../shared-lib/src/lib/logo/logo.component';
import { NavigLinkComponent } from './navig-link/navig-link.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NavigLinkComponent, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  isSidebarOpen = false;
  isSidebarAnimating = false;
  isLargeScreen = false;

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 1024;
    if (this.isLargeScreen) {
      this.isSidebarOpen = true;
    } else {
      this.isSidebarOpen = false;
    }
  }

  toggleSidebar() {
    this.isSidebarAnimating = true;
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onSidebarTransitionEnd() {
    this.isSidebarAnimating = false;
  }
}
