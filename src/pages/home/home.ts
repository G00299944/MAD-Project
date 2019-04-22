import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeatherDataProvider } from '../../providers/weather-data/weather-data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  weatherData:any = [];

  private description:string;
  private humidity:number;
  private temperature:number;
  private windSpeed:number;
  private location:string;

  constructor(public navCtrl: NavController, private weatherProvider: WeatherDataProvider) {

  }

  ionViewDidLoad() {
    this.weatherProvider.getWeatherData().subscribe(data => {
      this.buildWeatherData(data);
      //console.log(data);
    })
  }

  buildWeatherData(data:any) {
    this.description = data.weather[0].description;
    this.humidity = data.main.humidity;
    this.temperature = this.convertKelvinDegrees(data.main.temp);
    this.windSpeed = this.convertWindSpeed(data.wind.speed);
    this.location = data.name + " - " + data.sys.country;
  }


  convertKelvinDegrees(tempKelvin:number): number {
    let KELVIN:number = 273.15;
    return Math.round(tempKelvin - KELVIN);
  }

  convertWindSpeed(wind: number): number {
    return wind*10;
  }

}
