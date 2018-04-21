import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, AlertController, ModalController} from 'ionic-angular';
import * as moment from 'moment';

/**
 * Generated class for the EventModalCalendarDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-event-modal-calendar-details',
  templateUrl: 'event-modal-calendar-details.html',
})
export class EventModalCalendarDetailsPage {

  selectedEvent: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              private alertCtrl: AlertController, private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.selectedEvent = this.navParams.get('selectedEvent');
    console.log('viewing event : ', this.selectedEvent);
    this.selectedEvent.startTimeFormatted = moment(this.selectedEvent.startTime).format('LLLL');
    this.selectedEvent.endTimeFormatted = moment(this.selectedEvent.endTime).format('LLLL');
  }

  edit() {
    let modal = this.modalCtrl.create('EventModalPage', {selectedEvent: this.selectedEvent});
    modal.present();
    modal.onDidDismiss(modifiedEvent => {
      this.selectedEvent = modifiedEvent;
      this.selectedEvent.creator = modifiedEvent.creator.hasOwnProperty('self') ? 'Yourself' : modifiedEvent.creator.email;
      this.selectedEvent.location = modifiedEvent.hasOwnProperty('location') ? modifiedEvent.location : '';
      this.selectedEvent.description = modifiedEvent.hasOwnProperty('description') ? modifiedEvent.description : '';
      this.selectedEvent.startTimeFormatted = moment(this.selectedEvent.startTime).format('LLLL');
      this.selectedEvent.endTimeFormatted = moment(this.selectedEvent.endTime).format('LLLL');
    });
  }

  delete() {
    let alert = this.alertCtrl.create({
      title: 'Confirm deletion',
      message: 'Are you sure you want to delete this event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.viewCtrl.dismiss({action: "delete", event: this.selectedEvent});
          }
        }
      ]
    });
    alert.present();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

}
