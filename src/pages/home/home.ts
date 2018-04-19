import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { GHttpProvider } from '../../providers/g-http/g-http';

import { CalendarPage } from '../calendar/calendar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [GooglePlus]
})
export class HomePage {
  displayName: any;
  email: any;
  familyName: any;
  givenName: any;
  userId: any;
  imageUrl: any;
  calendarList: any;


  isLoggedIn:boolean = false;

  constructor(public navCtrl: NavController, private googlePlus: GooglePlus, private gHttpProvider: GHttpProvider) {
    if(localStorage.getItem("gToken") === null)
      localStorage.setItem("gToken", '[]');
  }

  login() {
    /*if (localStorage.getItem("gToken") !== null) {
      this.calendarList = this.gHttpProvider.get('https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=owner', localStorage.getItem("gToken"));
	  console.log(this.calendarList);
    }else{
      this.googlePlus.login({
        'scopes': 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly',
        'webClientId': '235375545183-c9r6vgbgl2k3sh8rf3vd62s9vpbhlvb4.apps.googleusercontent.com',
        'offline':true,
      })
      .then(res => {
	  	this.calendarList = this.gHttpProvider.get('https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=owner', res.serverAuthCode );
		localStorage.setItem("gToken", res.accessToken);
	  	console.log(res.accessToken);
		console.log(res.serverAuthCode);
	  	console.log(res);
	  	console.log(this.calendarList);
        this.displayName = res.displayName;
        this.email = res.email;
        this.familyName = res.familyName;
        this.givenName = res.givenName;
        this.userId = res.userId;
        this.imageUrl = res.imageUrl;

        this.isLoggedIn = true;
      })
      .catch(err => console.error(err));
    }*/

    this.gHttpProvider.login()
    .then(res => {
      console.log(res);
      this.displayName = res.displayName;
      this.email = res.email;
      this.familyName = res.familyName;
      this.givenName = res.givenName;
      this.userId = res.userId;
      this.imageUrl = res.imageUrl;

      this.isLoggedIn = true;
    })
    .catch(err => console.error(err));
  }

  logout() {
    this.googlePlus.logout()
      .then(res => {
        console.log(res);
        this.displayName = "";
        this.email = "";
        this.familyName = "";
        this.givenName = "";
        this.userId = "";
        this.imageUrl = "";

        this.isLoggedIn = false;
      })
      .catch(err => console.error(err));
  }

  showCalendarPage() {
    this.navCtrl.push(CalendarPage);
  }

}
