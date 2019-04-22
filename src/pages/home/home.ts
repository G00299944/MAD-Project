import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeatherDataProvider } from '../../providers/weather-data/weather-data';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { SettingsPage } from '../settings/settings';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  weatherData:any = [];

  private units:boolean;

  description:string;
  humidity:number;
  temperature:number;
  windSpeed:number;
  location:string;

  private cityQuery:string;


  constructor(public navCtrl: NavController, private weatherProvider: WeatherDataProvider, private storage: Storage) {

  }

  ionViewDidLoad() {
    this.weatherProvider.getWeatherData().subscribe(data => {
      this.buildWeatherData(data);
    })

  }

  ionViewDidEnter() {
    this.storage.get('units').then((val) => {
      this.units = val;
    })
  }

  buildWeatherData(data:any) {
    this.description = data.weather[0].description;
    this.humidity = data.main.humidity;
    this.temperature = this.convertKelvinDegrees(data.main.temp);
    this.windSpeed = this.convertWindSpeed(data.wind.speed);
    this.location = data.name + " - " + data.sys.country;
  }

  weatherDataQuery() {
   this.weatherProvider.weatherQuery(this.cityQuery).subscribe(data => {
     this.buildWeatherData(data);
   })

   //this.flashlight.switchOn();
  }

  convertKelvinDegrees(tempKelvin:number): number {
    let KELVIN:number = 273.15;
    return Math.round(tempKelvin - KELVIN);
  }

  convertWindSpeed(wind: number): number {
    return wind*3.6;
  }

  pushSettingsPage() {
    this.navCtrl.push(SettingsPage);
  }



}
