import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeatherTrackingPage } from './weather-tracking';

@NgModule({
  declarations: [
    WeatherTrackingPage,
  ],
  imports: [
    IonicPageModule.forChild(WeatherTrackingPage),
  ],
})
export class WeatherTrackingPageModule {}
