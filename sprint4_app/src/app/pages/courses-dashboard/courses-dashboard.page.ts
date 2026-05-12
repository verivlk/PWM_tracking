import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { Course } from '../../models/course.model';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { searchOutline, personCircle, star, starOutline } from 'ionicons/icons';


@Component({
  selector: 'app-courses-dashboard',
  templateUrl: './courses-dashboard.page.html',
  styleUrls: ['./courses-dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CoursesDashboardPage {

  constructor() {
    addIcons({ searchOutline, personCircle, star, starOutline });
  }

  selectedSegment: 'all' | 'favorites' = 'all';
  searchQuery = '';

  // Tutti i corsi ora partono con isFavorite: false
  courses: Course[] = [
    { id: '1', title: 'Programmazione Web e Mobile', acronym: 'PWM', description: 'Descrizione corso...', imageUrl: '', isFavorite: false },
    { id: '2', title: 'Fondamenti di Sistemi Informatici', acronym: 'FSI', description: 'Descrizione corso...', imageUrl: '', isFavorite: false },
    { id: '3', title: 'Fondamenti di Sistemi Operativi', acronym: 'FSO', description: 'Descrizione corso...', imageUrl: '', isFavorite: false },
    { id: '4', title: 'Software Engineering II', acronym: 'SWE II', description: 'Descrizione corso...', imageUrl: '', isFavorite: false },
    { id: '5', title: 'Sistemi Intelligenti', acronym: 'SI', description: 'Descrizione corso...', imageUrl: '', isFavorite: false },
  ];

  private navCtrl = inject(NavController);
  private authService = inject(AuthService);
  private toastCtrl = inject(ToastController);

  get isGuest(): boolean {
    return this.authService.getCurrentUser() === null;
  }

  async requireLogin(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3500,
      position: 'bottom',
      color: 'dark',
      buttons: ['OK']
    });
    await toast.present();

    // Rimanda l'utente alla pagina iniziale
    this.navCtrl.navigateRoot('/welcome');
  }

  segmentChanged(event: any) {
    const targetSegment = event.detail.value;

    if (targetSegment === 'favorites' && this.isGuest) {
      setTimeout(() => this.selectedSegment = 'all', 10);
      this.requireLogin('You need to log in to view your favorites.');
      return;
    }

    this.selectedSegment = targetSegment;
  }

  getFilteredCourses(): Course[] {
    let filtered = this.courses;

    if (this.selectedSegment === 'favorites') {
      filtered = filtered.filter(c => c.isFavorite);
    }

    if (this.searchQuery.trim() !== '') {
      filtered = filtered.filter(c =>
        c.acronym.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    return filtered;
  }

  toggleFavorite(course: Course, event: Event) {
    event.stopPropagation();

    // Se non sei loggato, vieni reindirizzato alla Welcome Page
    if (this.isGuest) {
      this.requireLogin('You need to log in to save a course as favorite.');
      return;
    }

    course.isFavorite = !course.isFavorite;
  }

  goToDetail(courseId: string) {
    this.navCtrl.navigateForward(`/course-info/${courseId}`);
  }

  goToProfile() {
    if (this.isGuest) {
      this.requireLogin('You need to log in to view your profile.');
      return;
    }

    this.navCtrl.navigateForward('/account');
  }
}
