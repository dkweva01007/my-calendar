import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
  myIndex: number;
  isLoggedIn:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private googlePlus: GooglePlus, private gHttpProvider: GHttpProvider) {
    if(localStorage.getItem("gToken") === null) {
      localStorage.setItem("gToken", '[]');
    }
    this.myIndex = navParams.data.tabIndex || 0;
    this.gHttpProvider.silentLogin().then(res => {
      console.log("silent login success: ", res);
      this.displayName = res.displayName;
      this.email = res.email;
      this.familyName = res.familyName;
      this.givenName = res.givenName;
      this.userId = res.userId;
      this.imageUrl = res.imageUrl;

      this.isLoggedIn = true;
      this.showCalendarPage();
    }).catch(err => { console.log('no silent login: ', err)});
  }

  login() {
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

  // NOT WORKING
  refreshToken() {
    this.gHttpProvider.refreshAccessToken().then(res => {
      console.log(res);
      this.displayName = res.displayName;
      this.email = res.email;
      this.familyName = res.familyName;
      this.givenName = res.givenName;
      this.userId = res.userId;
      this.imageUrl = res.imageUrl;

      this.isLoggedIn = true;
    }).catch(err => console.error(err));
  }




}
