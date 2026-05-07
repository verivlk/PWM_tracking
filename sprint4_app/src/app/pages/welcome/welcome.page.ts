import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  // RouterModule is required here so the HTML routerLink buttons function!
  imports: [IonicModule, CommonModule, RouterModule]
})
export class WelcomePage {

  constructor() {}

}
