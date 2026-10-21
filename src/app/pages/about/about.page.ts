import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-about',
  imports: [HeaderComponent, IonContent],
  templateUrl: './about.page.html',
  styleUrl: './about.page.scss'
})
export class AboutPage {

}
