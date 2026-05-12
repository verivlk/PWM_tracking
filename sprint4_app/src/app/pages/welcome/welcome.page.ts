import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class WelcomePage implements OnInit {
  private authService = inject(AuthService);

  // Esegue il logout automatico appena la pagina Welcome viene caricata
  async ngOnInit() {
    await this.authService.logout();
  }
}
