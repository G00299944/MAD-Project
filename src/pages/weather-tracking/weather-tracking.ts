import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { WeatherDataProvider } from '../../providers/weather-data/weather-data';
import { AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-weather-tracking',
  templateUrl: 'weather-tracking.html',
})
export class WeatherTrackingPage {
  private weatherList:string[] = [];
  private weatherObjects:any[] = [];
  private tempUnits:boolean = true;
  private windUnits:boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private weatherProvider: WeatherDataProvider, private storage: Storage, private alert: AlertController) {
  }

  removeWeatherList(city:string) {
    for (let i:number = 0; i < this.weatherList.length; i++) {
      if(this.weatherList[i].localeCompare(city) == 0) {
        var deletedCity = this.weatherList.splice(i,1);
        this.weatherObjects.splice(i,1); // done so it removes from page without needing to be reloaded
        //console.log(deletedCity);
        //console.log(this.weatherList);
        this.storage.set('weatherList', this.weatherList);
        this.validCityAlert(city);
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WeatherTrackingPage');
    this.loadWeatherList();
    this.loadUnits();
  }

  ionViewDidEnter() {
    this.generateWeatherObjects();
  }

  loadWeatherList() {
    this.weatherList = [];

    this.storage.get('weatherList').then((val) => {
      if (val!=null) {
        this.weatherList = val;
      }
    })
  }

  weatherDataQuery(cityName:string): any {
    this.weatherProvider.weatherQuery(cityName).subscribe(data => {
      this.buildWeatherData(data);
    })
  }

  buildWeatherData(data:any) {
    let w: Weather = new Weather(data);
    this.weatherObjects.push(w);
  }

  generateWeatherObjects() {
    for (let i:number = 0; i < this.weatherList.length; i++) {
      this.weatherDataQuery(this.weatherList[i]);
    }
  }

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

  // alert methods ==================================================
  validCityAlert(city:string) {
    let alert=this.alert.create({
      title:"Weather Tracking",
      subTitle: "Success: " + city + " has been removed from weather tracking.",
      buttons:['ok']

    });
    alert.present();
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
