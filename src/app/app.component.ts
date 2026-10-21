import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
//import { RouterOutlet } from '@angular/router';
import {
  IonApp,
  IonRouterOutlet, IonContent } from '@ionic/angular/standalone';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [ IonRouterOutlet,
    SidebarComponent,
    IonApp
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = `test-ionic2`;
}
