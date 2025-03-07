import { Component, Input, OnInit } from '@angular/core';
import { IonButton } from '@ionic/angular';

@Component({
  selector: 'app-mc-button',
  templateUrl: './mc-button.component.html',
  styleUrls: ['./mc-button.component.scss'],
})
export class McButtonComponent {
  @Input() click?;
  @Input() text?: string = 'loading';
  @Input() isLoading?: boolean;
  @Input() icon?: string;
  @Input() fill: MCButtonFill;
  @Input() expand = 'block';
  @Input() disabled = false;
}

type MCButtonFill = 'clear' | 'default' | 'outline' | 'solid' | undefined;
