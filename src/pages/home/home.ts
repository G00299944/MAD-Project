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

  private weatherData:any = [];

  private units:boolean = true;

  private description:string;
  private humidity:number;
  private temperatureC:number;
  private temperatureF:number;
  private windSpeedMetric:number;
  private windSpeedImperial:number;
  private location:string;

  private cityQuery:string;


  constructor(public navCtrl: NavController, private weatherProvider: WeatherDataProvider, private storage: Storage) {

  }

  ionViewDidLoad() {
    this.loadUnits();

  }

  ionViewDidEnter() {
    this.loadUnits();
  }

  buildWeatherData(data:any) {
    this.description = data.weather[0].description;
    this.humidity = data.main.humidity;
    this.temperatureC = this.convertKelvinDegrees(data.main.temp);
    this.temperatureF = this.convertKelvinFahrenheit(data.main.temp);
    this.windSpeedMetric = this.convertWindSpeedKilometers(data.wind.speed);
    this.windSpeedImperial = this.convertWindSpeedMiles(data.wind.speed);
    this.location = data.name + ", " + data.sys.country;
  }

  weatherDataQuery() {
   this.weatherProvider.weatherQuery(this.cityQuery).subscribe(data => {
     this.buildWeatherData(data);
   })
  }

  convertKelvinDegrees(tempKelvin:number): number {
    let KELVIN:number = 273.15;
    return Math.round(tempKelvin - KELVIN);
  }

  convertKelvinFahrenheit(tempKelvin:number): number {
    return (this.convertKelvinDegrees(tempKelvin)*9/5)+32;
  }

  convertWindSpeedKilometers(wind: number): number {
    return wind*3.6;
  }

  convertWindSpeedMiles(wind: number): number {
    return wind*2.237;
  }

  pushSettingsPage() {
    this.navCtrl.push(SettingsPage);
  }

  loadUnits() {
    this.storage.get('units').then((val) => {
      this.units = val;
    })
  }



}
