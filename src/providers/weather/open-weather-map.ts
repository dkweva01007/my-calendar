import { Injectable, Component } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class WeatherInfoProvider {

  API_KEY = '37ecab75d89afd994c78c30e801cfec6';

  constructor(public http: Http) { }

  /**
   * Call the weather API to get the forecast for the next five days.
   * @param {string} cityName          City name
   * @param {string} countryCode       Code of the country (ex: 'fr' for 'France')
   * @returns {Promise<object>}
   */
  getWeatherForecast(cityName, countryCode): Promise<any> {
    let weathertmp = this;

    return new Promise(function (resolve, reject) {
      console.log('WeatherInfo Provider | Calling forcast..');

      weathertmp.http
      .get('http://api.openweathermap.org/data/2.5/forecast?q='+ cityName.trim() +',' + countryCode.trim() +'&units=metric&appid=' + weathertmp.API_KEY)
      .toPromise()
      .then(data => {
        var weather = JSON.parse(data['_body']);
        var map = new Map();
        var stringDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        console.log("Weather for : " + weather.city.name);
        var list = weather.list;

        for (var i = 0 ; i < weather.cnt ; i ++ ){

          var date = new Date(list[i].dt*1000);

          if ( !map.has( date.getDate() ) ) {
             map.set(date.getDate(), new Array());
           }

          map.get(date.getDate())
          .push(
            { readableDate: stringDays[date.getDay()] + " " + date.getDate() + ", " + date.getHours() + ":" + date.getMinutes(),
              time: date.getHours() + ':' + ((date.getMinutes().toString().length == 1) ? date.getMinutes().toString() + '0' : date.getMinutes().toString() ),
              temp: list[i].main.temp.toFixed(2) + '°C',
              weather: list[i].weather[0].main + '(' + list[i].weather[0].description + ')',
              windSpeed: list[i].wind.speed + ' m/s (' + list[i].wind.speed*3.6 + ' km/h)',
              icon: 'http://openweathermap.org/img/w/' + list[i].weather[0].icon + '.png'
            });

        }
        resolve(map);
      })
      .catch(err => {
        console.log('Weather fetching | error : ', err);
        reject(err);
      });
    });
  }


}
