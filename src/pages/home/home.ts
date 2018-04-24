import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { GHttpProvider } from '../../providers/g-http/g-http';
import { AuthProvider } from '../../providers/auth/auth';
import { CalendarPage } from '../calendar/calendar';
import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: any;
  calendars;
  myIndex: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private gHttpProvider: GHttpProvider, public menuCtrl: MenuController, private auth: AuthProvider) {
    if(localStorage.getItem("gToken") === null)
      localStorage.setItem("gToken", '[]');
    this.myIndex = navParams.data.tabIndex || 0;

    this.user = firebase.auth().currentUser;
  }

  ionViewDidLoad() {
    this.menuCtrl.enable(true, 'myMenu');

    this.gHttpProvider.queryGoogle({
      method: 'GET',
      URI: 'https://www.googleapis.com/calendar/v3/users/me/calendarList'
    }).then(calendarList => {
      this.calendars = [];
      for(let calendar of calendarList.items) {
        if(calendar.accessRole !== 'freeBusyReader') {
          this.calendars.push({
            id: this.auth.getCurrentUser().email === calendar.id ? 'primary' : calendar.id,
            summary: calendar.summary,
            accessRole: calendar.accessRole
          });
        }
      }
    }).catch(err => console.error('CalendarPate | Error getting calendar events : ', err));
  }

  viewCalendar(calendar) {
    this.navCtrl.push(CalendarPage, {selectedCalendar : calendar});
  }

}
