import { Component } from '@angular/core';
import { NavController, Alert } from 'ionic-angular';
import { WeatherDataProvider } from '../../providers/weather-data/weather-data';
import { SettingsPage } from '../settings/settings';
import { Storage } from '@ionic/storage';
import { WeatherTrackingPage } from '../weather-tracking/weather-tracking';
import { AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // Member Variables
  private weatherObj:Weather = null;
  private tempUnits:boolean = true;
  private windUnits:boolean = true;
  private cityQuery:string;
  private weatherList:string[];
  private lon:number;
  private lat:number;


  constructor(public navCtrl: NavController, private weatherProvider: WeatherDataProvider, 
    private storage: Storage, private alert: AlertController, private geolocation: Geolocation) {

  }

  // Methods ====================================================================================================
  // ion load methods ==================================================
  ionViewDidLoad() {
    this.loadGPS();
  }

  ionViewDidEnter() {
    this.loadUnits(); // so that changes made to units would be reflected when the settings page is popped off stack
    this.loadWeatherList();
  }
  

  // weather data methods ==================================================
  buildWeatherData(data:any) { // takes in JSON data and instantiates a new Weather object
    let w: Weather = new Weather(data);
    this.weatherObj = w;
  }

  weatherDataQuery(cityName:string): any { // takes a city:string and makes an API call 
   this.weatherProvider.getWeatherDataCity(cityName).subscribe(data => {
     this.buildWeatherData(data);},
     error => this.invalidQueryAlert(cityName));
  }

  weatherDataGPS(lon:number, lat:number): any { // takes a lon & lat and makes an API call 
    this.weatherProvider.getWeatherDataGPS(lon, lat).subscribe(data => {
      this.buildWeatherData(data);
      console.log(data);
    })
  }

  addWeatherList(city:string) { // saves a city to an array of cities to track weather in
    let isTracked:boolean = false;

    for (let i:number = 0; i < this.weatherList.length; i++) { // iterate through weatherList to check if city is already being tracked
      if (this.weatherList[i].localeCompare(city) == 0) {
        isTracked = true;
      }
    }

    if (!isTracked) { // if un-tracked: add it to array
      this.weatherList.push(city);
      this.storage.set('weatherList', this.weatherList);
      this.validCityAlert(city);
    }
    else { // else alert error
      this.invalidCityAlert(city);
    }

  }

  loadWeatherList() { //  read in tracked weather array from local storage
    this.weatherList = [];

    this.storage.get('weatherList').then((val) => {
      if (val!=null) {
        this.weatherList = val;
      }
      //console.log("load: ", this.weatherList);
    })
  }

  loadGPS() { //  takes users current gps location and produce weather data 
    this.geolocation.getCurrentPosition().then((response) => {
      this.lon = response.coords.longitude;
      this.lat = response.coords.latitude;
      //console.log("lon: " + this.lon + "lat: " + this.lat);
      this.weatherDataGPS(this.lon, this.lat);
    }).catch((error) => {
      //console.log('Error getting location', error);
    });
  }


  // nav methods ==================================================
  pushSettingsPage() {
    this.navCtrl.push(SettingsPage);
  }

  pushWeatherTrackingPage() {
    this.navCtrl.push(WeatherTrackingPage);
  }


  // alert methods ==================================================
  validCityAlert(city:string) {
    let alert=this.alert.create({
      title:"Weather Tracking",
      subTitle: "Success: " + city + " has been added to weather tracking.",
      buttons:['ok']

    });
    alert.present();
  }

  invalidCityAlert(city:string) {
    let alert=this.alert.create({
      title:"Weather Tracking",
      subTitle: "Error: " + city + " is already being tracked.",
      buttons:['ok']

    });
    alert.present();
  }

  invalidQueryAlert(city:string) {
    let alert=this.alert.create({
      title:"Weather Tracking",
      subTitle: "Error: " + " could not find " + city,
      buttons:['ok']

    });
    alert.present();
  }


  // misc. methods ==================================================
  loadUnits() { // read in user units settings (metric/imperial)
    this.storage.get('tempUnits').then((val) => {
      if(val!=null) { // if a previous setting is stored set it
        this.tempUnits = val;
      }
      else { // else defualt to metric
        this.tempUnits = true;
      }
    })

    this.storage.get('windUnits').then((val) => {
      if(val!=null) { // if a previous setting is stored set it
        this.windUnits = val;
      }
      else { // else defualt to metric
        this.windUnits = true;
      }
    })
  }

  // DEBUG_CLEAR_STORAGE() {   // DEBUGGING method to wipe local storage for testing purposes
  //   this.storage.clear();
  // }

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
