import { Component } from '@angular/core';
import { NavController, Alert } from 'ionic-angular';
import { WeatherDataProvider } from '../../providers/weather-data/weather-data';
import { SettingsPage } from '../settings/settings';
import { Storage } from '@ionic/storage';
import { WeatherTrackingPage } from '../weather-tracking/weather-tracking';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // Member Variables
  private weatherObj:any = null;
  private tempUnits:boolean = true;
  private windUnits:boolean = true;
  private cityQuery:string;
  private weatherList:string[];


  constructor(public navCtrl: NavController, private weatherProvider: WeatherDataProvider, private storage: Storage, private alert: AlertController) {

  }

  weatherTrackingAlert(city:string) {
    let alert=this.alert.create({
      title:"Weather List Updated!",
      subTitle: "Added " + city + " to your weather list.",
      buttons:['ok']

    });
    alert.present();
  }

  // Methods ====================================================================================================

  // ion load methods ==================================================
  ionViewDidLoad() {
    this.loadUnits();
  }

  ionViewDidEnter() {
    this.loadUnits();
    this.loadWeatherList();
  }

  // weather data methods ==================================================
  buildWeatherData(data:any) {
    let w: Weather = new Weather(data);
    this.weatherObj = w;
  }

  weatherDataQuery(cityName:string): any{
   this.weatherProvider.weatherQuery(cityName).subscribe(data => {
     this.buildWeatherData(data);
   })
  }

  addWeatherList(city:string) {
    this.weatherList.push(city);
    this.storage.set('weatherList', this.weatherList);
    this.weatherTrackingAlert(city);
  }

  loadWeatherList() {
    this.weatherList = [];

    this.storage.get('weatherList').then((val) => {
      if (val!=null) {
        this.weatherList = val;
      }
      console.log("load: ", this.weatherList);
    })
  }

  // nav methods ==================================================
  pushSettingsPage() {
    this.navCtrl.push(SettingsPage);
  }

  pushWeatherTrackingPage() {
    this.navCtrl.push(WeatherTrackingPage);
  }


  // misc. methods ==================================================
  loadUnits() {
    this.storage.get('tempUnits').then((val) => {
      if(val!=null) {
        this.tempUnits = val;
      }
      else {
        this.tempUnits = true;
      }
    })

    this.storage.get('windUnits').then((val) => {
      if(val!=null) {
        this.windUnits = val;
      }
      else {
        this.windUnits = true;
      }
    })
  }



  DEBUG_CLEAR_STORAGE() {
    this.storage.clear();
  }

}

class Weather {

  // Member Variables
  private description:string;
  private humidity:number;
  private temperatureC:number;
  private temperatureF:number;
  private windSpeedMetric:number;
  private windSpeedImperial:number;
  private location:string;

  // Constructors
  constructor(data:any) {
    this.description = data.weather[0].description;
    this.humidity = data.main.humidity;
    this.temperatureC = this.convertKelvinDegrees(data.main.temp);
    this.temperatureF = this.convertKelvinFahrenheit(data.main.temp);
    this.windSpeedMetric = this.convertWindSpeedKilometers(data.wind.speed);
    this.windSpeedImperial = this.convertWindSpeedMiles(data.wind.speed);
    this.location = data.name;
  }

  // Other Methods
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
}
