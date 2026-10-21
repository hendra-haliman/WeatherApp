import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
// import { AboutPage } from './pages/about/about.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomePage
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.page').then(m => m.AboutPage)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
