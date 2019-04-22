import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

/*
  Generated class for the WeatherDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WeatherDataProvider {

  constructor(public http: HttpClient) {
    console.log('Hello WeatherDataProvider Provider');
  }

  getWeatherData():Observable<any> {
    return this.http.get("http://api.openweathermap.org/data/2.5/weather?lat=53.274395&lon=-9.049201&appid=bed50d9b8431cf9e4d4e6339b0a31138");
  }

}
