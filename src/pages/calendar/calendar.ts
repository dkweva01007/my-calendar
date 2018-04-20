import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { GHttpProvider } from '../../providers/g-http/g-http';

import * as moment from 'moment';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage {
  eventSource;
  viewTitle;

  myIndex: number;
  selectedDay = new Date();

  isToday: boolean;
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    dateFormatter: {
      formatMonthViewDay: function(date:Date) {
        return date.getDate().toString();
      },
      formatMonthViewDayHeader: function(date:Date) {
        return 'MonMH';
      },
      formatMonthViewTitle: function(date:Date) {
        return 'testMT';
      },
      formatWeekViewDayHeader: function(date:Date) {
        return 'MonWH';
      },
      formatWeekViewTitle: function(date:Date) {
        return 'testWT';
      },
      formatWeekViewHourColumn: function(date:Date) {
        return 'testWH';
      },
      formatDayViewHourColumn: function(date:Date) {
        return 'testDH';
      },
      formatDayViewTitle: function(date:Date) {
        return 'testDT';
      }
    }
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private alertCtrl: AlertController, private gHttpProvider: GHttpProvider) {
    this.myIndex = navParams.data.tabIndex || 0;
    this.gHttpProvider.getMyCalendarEvents()
      .then(events => {
        this.eventSource = [];
        let tmp = this;
        events.forEach(function (event, index) {
          tmp.eventSource.push({
            title: event.summary,
            startTime: event.start.hasOwnProperty('dateTime') ? new Date(event.start.dateTime) : new Date(event.start.date),
            endTime: event.end.hasOwnProperty('dateTime') ? new Date(event.end.dateTime) : new Date(event.end.date),
            allDay: event.start.hasOwnProperty('date')
          });
        });
      })
      .catch(err => console.error(err));
  }

  addEvent() {
    let modal = this.modalCtrl.create('EventModalPage', {selectedDay: this.selectedDay});
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        let eventData = data;

        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);

        let events = this.eventSource;
        events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });
      }
    });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');

    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    });
    alert.present();
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

  onCurrentDateChanged(event:Date) {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
  }

}
