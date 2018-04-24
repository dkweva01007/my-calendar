import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { GHttpProvider } from '../../providers/g-http/g-http';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage {
  eventSource;
  viewTitle;

  myIndex: number;
  selectedDay = new Date();

  selectedCalendar: any;
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
              private gHttpProvider: GHttpProvider) {
    this.myIndex = navParams.data.tabIndex || 0;

    this.selectedCalendar = this.navParams.get('selectedCalendar');
    this.showAllGoogleEventsOnCalendar();
  }

  showAllGoogleEventsOnCalendar() {
    console.log("selected calendar id: ", this.selectedCalendar.id);
    this.gHttpProvider.queryGoogle({
      method: 'GET', params: { 'calendarId' : this.selectedCalendar.id },
      URI: 'https://www.googleapis.com/calendar/v3/calendars/' + this.selectedCalendar.id + '/events'
    }).then(calendarEvents => {
      this.eventSource = [];
      console.log('calendarEvents : ', calendarEvents);
      /*
      let tmp = this
        , events = calendarEvents.items.reverse();
      console.log('events : ', event);
      events.forEach(function (event) {
        tmp.addGoogleEvent(event);
      });
      */
      for(let event of calendarEvents.items.reverse()) {
        this.addGoogleEvent(event);
      }
    }).catch(err => console.error('CalendarPate | Error getting calendar events : ', err));
  }

  addGoogleEvent(googleEvent) {
    if(googleEvent && googleEvent.hasOwnProperty('start') && googleEvent.hasOwnProperty('end') &&  googleEvent.hasOwnProperty('creator')) {
      this.eventSource.push({
        id: googleEvent.id,
        status: googleEvent.status,
        title: googleEvent.summary,
        creator: googleEvent.creator.hasOwnProperty('self') ? 'Yourself' : googleEvent.creator.email,
        startTime: googleEvent.start.hasOwnProperty('dateTime') ? new Date(googleEvent.start.dateTime) : new Date(googleEvent.start.date),
        endTime: googleEvent.end.hasOwnProperty('dateTime') ? new Date(googleEvent.end.dateTime) : new Date(googleEvent.end.date),
        allDay: googleEvent.start.hasOwnProperty('date'),
        location: googleEvent.hasOwnProperty('location') ? googleEvent.location : '',
        attendees: googleEvent.hasOwnProperty('attendees') ? googleEvent.attendees : '',
        description: googleEvent.hasOwnProperty('description') ? googleEvent.description : ''
      });
    } else {
      console.log('google event not added, something wrong with it');
    }

  }

  addEvent() {
    let modal = this.modalCtrl.create('EventModalPage', {
      selectedDay: this.selectedDay, selectedCalendar: this.selectedCalendar
    });
    modal.present();
    modal.onDidDismiss(savedEvent => {
      this.showAllGoogleEventsOnCalendar();
    });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(selectedEvent) {
    let modal = this.modalCtrl.create(
      'EventModalCalendarDetailsPage',
      {selectedEvent: selectedEvent, selectedCalendar: this.selectedCalendar}
      );
    modal.present();
    modal.onDidDismiss(params => {
      if(params && params.action === "delete") {
        this.gHttpProvider.queryGoogle({
          method: 'DELETE', params: { 'calendarId' : this.selectedCalendar.id },
          URI: 'https://www.googleapis.com/calendar/v3/calendars/primary/events/' + params.event.id
        }).then(response => {
          this.showAllGoogleEventsOnCalendar();
        }).catch(err => console.error('err on deleting event: ', err));
      }
    });
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
