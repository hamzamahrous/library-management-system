import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navig-link',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navig-link.component.html',
  styleUrl: './navig-link.component.css',
})
export class NavigLinkComponent {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) routeLink!: string;
}
