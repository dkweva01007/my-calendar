import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { GHttpProvider } from '../../providers/g-http/g-http';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-event-modal',
  templateUrl: 'event-modal.html',
})
export class EventModalPage {

  editMode:boolean = false;
  groupMembers: any;
  selectedCalendar: any;
  event = {
    startTime: new Date().toISOString(), endTime: new Date().toISOString(),
    allDay: false, title: "", location: "", description: "", id: null
  };
  minDate = new Date().toISOString();

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              private alertCtrl: AlertController, private gHttpProvider: GHttpProvider, private auth: AuthProvider,
              private fireDB: DatabaseProvider) {
    this.selectedCalendar = this.navParams.get('selectedCalendar');
    this.addMembersToEvent()
      .then((members) => this.groupMembers = members)
      .catch(err => console.error('Event Modal | Event share to members | err : ', err));
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
    } else if (this.event.endTime <= this.event.startTime) {
      let alert = this.alertCtrl.create({
        title: 'Invalid Date',
        subTitle: 'End date should not be earlier or equal to the start date.',
        buttons: ['OK']
      });
      alert.present();
    } else {
      this.saveToGoogleCalendar();
    }
  }

  saveToGoogleCalendar() {
    console.log('save to ' + this.selectedCalendar.summary + 'w/ id: ', this.selectedCalendar.id);
    let queryParams = {
      method: this.editMode ? "PATCH" : "POST",
      URI: 'https://www.googleapis.com/calendar/v3/calendars/' + this.selectedCalendar.id + '/events'
    };
    if(this.editMode)
      queryParams.URI += '/' + this.event.id;
    let resource = {
      'summary': this.event.title, 'end': {}, 'start': {},
      'location': this.event.location.length != 0 ? this.event.location : null,
      'description': this.event.description.length != 0 ? this.event.description : null,
      'attendees': this.groupMembers, 'reminders': { useDefault: true }
    };
    if(this.event.allDay) {
      resource.start['date'] = moment(new Date(this.event.startTime)).format('YYYY-MM-DD');
      resource.end['date'] = moment(new Date(this.event.endTime)).format('YYYY-MM-DD');
      resource['transparency'] = 'transparent';
      //resource['reminders'] = { useDefault : false };
    } else {
      resource.start['dateTime'] = new Date(this.event.startTime).toISOString();
      resource.end['dateTime'] = new Date(this.event.endTime).toISOString();
    }
    console.log('save new event w/ request queryParams : ', queryParams);
    console.log('save new event w/ request body : ', resource);
    this.gHttpProvider.queryGoogle({
      method: queryParams.method, URI: queryParams.URI,
      params: { 'calendarId' : this.selectedCalendar.id }, body: resource
    }).then(savedEvent => {
      console.log('Event Modal | Saved event : ', savedEvent);
      this.addMembersToEvent()
        .then(() => this.viewCtrl.dismiss(savedEvent))
        .catch(err => console.error('Event Modal | Event share to members | err : ', err));
    }).catch(err => console.error('Event Modal | Event saving | err : ', err));
  }

  addMembersToEvent(): Promise<any> {
    let tmp = this
      , members = [];
    return new Promise(function (resolve, reject) {
      try {
        tmp.fireDB.get('circle').then(circleObj => {
          let circleArr = tmp.flattenArray(Object.keys(circleObj).map(key => {
            return Object.keys(circleObj[key]).map(key2=>circleObj[key][key2]);
          }));
          let index = circleArr.findIndex(x => x.calendarID == tmp.selectedCalendar.id);
          if(index !== -1) {
            let membersToAdd = Object.keys(circleArr[index].members).map(key => (Object.assign({uid: key}, circleArr[index].members[key])));
            console.log('circleArr[index] : ', circleArr[index]);
            for(let member of membersToAdd) {
              members.push({
                email: member.email,
                id: member.uid,
                displayName: member.displayName
              })
            }
            resolve(members);
          }
        }).catch(err => console.log('Event Modal | Get Circle Members | err : ', err));
      } catch(err) {
        reject(err);
      }
    });
  }

  flattenArray(array) {
    let tmp = this;
    return array.reduce(function(r, e) {
      return Array.isArray(e) ? r.push(...tmp.flattenArray(e)) : r.push(e), r
    }, []);
  }

}
