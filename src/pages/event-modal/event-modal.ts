import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { GHttpProvider } from '../../providers/g-http/g-http';
import * as moment from 'moment';

/**
 * Generated class for the EventModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-modal',
  templateUrl: 'event-modal.html',
})
export class EventModalPage {

  editMode:boolean = false;
  event = {
    startTime: new Date().toISOString(), endTime: new Date().toISOString(),
    allDay: false, title: "", location: "", description: "", id: null
  };
  minDate = new Date().toISOString();

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              private alertCtrl: AlertController, private gHttpProvider: GHttpProvider) {
    if(this.navParams.get('selectedDay')) {
      this.editMode = false;
      let preselectedDate = moment(this.navParams.get('selectedDay')).format();
      this.event.startTime = preselectedDate;
      this.event.endTime = preselectedDate;
    }
    if(this.navParams.get('selectedEvent') !== undefined) {
      this.editMode = true;
      this.event = this.navParams.get('selectedEvent');
      this.event.location = this.event.location != '-' ? this.event.location : '';
      this.event.description = this.event.description != '-' ? this.event.description : '';
      this.event.startTime = moment(this.event.startTime).format();
      this.event.endTime = moment(this.event.endTime).format();
    }
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  save() {
    console.log('event to be saved :', this.event);
    if (this.event.title.length === 0) {
      let alert = this.alertCtrl.create({
        title: 'Invalid Form',
        subTitle: 'Title is required to create an event.',
        buttons: ['OK']
      });
      alert.present();
    } else if (this.event.endTime < this.event.startTime) {
      let alert = this.alertCtrl.create({
        title: 'Invalid Date',
        subTitle: 'End date should not be earlier than start date.',
        buttons: ['OK']
      });
      alert.present();
    } else {
      this.saveToGoogleCalendar();
    }
  }

  saveToGoogleCalendar() {
    let queryParams = {
      method: this.editMode ? "PATCH" : "POST",
      URI: 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
    };
    if(this.editMode)
      queryParams.URI += '/' + this.event.id;
    let resource = {
      'summary': this.event.title, 'end': {}, 'start': {},
      //'end': { 'dateTime': new Date(this.event.endTime).toISOString() },
      //'start': { 'dateTime': new Date(this.event.startTime).toISOString() },
      'location': this.event.location.length != 0 ? this.event.location : null,
      'description': this.event.description.length != 0 ? this.event.description : null
    };
    if(this.event.allDay) {
      resource.start['date'] = moment(new Date(this.event.startTime)).format('YYYY-MM-DD');
      resource.end['date'] = moment(new Date(this.event.endTime)).format('YYYY-MM-DD');
      resource['transparency'] = 'transparent';
      resource['reminders'] = { useDefault : false };
    } else {
      resource.start['dateTime'] = new Date(this.event.startTime).toISOString();
      resource.end['dateTime'] = new Date(this.event.endTime).toISOString();
    }
    console.log('save new event w/ request queryParams : ', queryParams);
    console.log('save new event w/ request body : ', resource);
    this.gHttpProvider.queryGoogle({
      method: queryParams.method, URI: queryParams.URI,
      params: { 'calendarId' : 'primary' }, body: resource
    }).then(savedEvent => {
      console.log('inserted event : ', savedEvent);
      this.viewCtrl.dismiss(savedEvent);
    }).catch(err => console.error('err on saving event: ', err));
  }

}
