import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

/**
 * Generated class for the CerclePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-cercle',
  templateUrl: 'cercle.html',
})
export class CerclePage {
  myIndex: number;
  cercle_friends: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController) {
    this.myIndex = navParams.data.tabIndex || 0;
  }

  ionViewDidLoad() {
    this.cercle_friends = JSON.parse(localStorage.getItem("cercle_friends"));
  }
  
  addCercleFriend() {
    let modal = this.modalCtrl.create('EventModalAddCerclePage', {selectedDay: this.selectedDay});
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

}
