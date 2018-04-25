import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { WeatherInfoProvider } from "../../providers/weather/open-weather-map";


@Component({
  selector: 'page-weather',
  templateUrl: 'weather.html',
})
export class WeatherPage {

  weatherForecast = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
              private weatherProvider: WeatherInfoProvider) {
  }

  fetchForcast() {
    var city = prompt("City name ?");
    this.weatherProvider.getWeatherForecast(city,"countryCode")
    .then((data)=> {
      console.log('WeatherPage | Successfully fetch');
      if (data instanceof Map){
        this.showForecast(data);
      }
    }).catch(err =>  console.log(err));

  }


  showForecast(map){
    this.weatherForecast =  Array.from(map);
    console.log(this.weatherForecast);
    document.getElementById("buttonGrid").style.display = 'none';
  }

}
