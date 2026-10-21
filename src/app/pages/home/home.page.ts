import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IonContent } from "@ionic/angular/standalone";
import { ComponentTestComponent } from '../../component-test/component-test.component';
import { HeaderComponent } from "../../header/header.component";
import { PlatformService } from '../../services/platform.service';
import { UserComponent } from '../../user/user.component';
import { WeatherComponent } from '../../weather/weather/weather.component';

@Component({
  selector: 'app-home',
  imports: [IonContent, MatButtonModule,
    HeaderComponent, WeatherComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage  {


  constructor(protected platformService: PlatformService) { }




}
