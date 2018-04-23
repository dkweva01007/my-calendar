import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { GHttpProvider } from '../../providers/g-http/g-http';
import { AuthProvider } from '../../providers/auth/auth';
import * as firebase from 'firebase';

import { CalendarPage } from '../calendar/calendar';
import { LoginPage } from "../login/login";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //user: { uid: '', email: '', displayName: '' };
  user: any;
  myIndex: number;

  // TODO 1.) add friends
  // TODO 2.) add friends to circles
  // TODO 3.) add circles as attendees

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private gHttpProvider: GHttpProvider, public menuCtrl: MenuController, private auth: AuthProvider) {
    if(localStorage.getItem("gToken") === null)
      localStorage.setItem("gToken", '[]');
    this.myIndex = navParams.data.tabIndex || 0;

    this.user = firebase.auth().currentUser;
  }

  ionViewDidLoad() {
    this.menuCtrl.enable(true, 'myMenu');
  }

  logout() {
    this.auth.logout()
      .then(() => {
        console.log('MenuPage | logged out');
        this.navCtrl.setRoot(LoginPage);
        this.navCtrl.popToRoot();
      })
      .catch(err => console.error(err));
  }

  showCalendarPage() {
    this.navCtrl.push(CalendarPage);
  }

  // NOT WORKING
  refreshToken() {
    this.gHttpProvider.refreshAccessToken().then(res => {
    }).catch(err => console.error(err));
  }

}
