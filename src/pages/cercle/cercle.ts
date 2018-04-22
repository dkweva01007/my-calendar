import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

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
    this.cercle_friends = JSON.parse(localStorage.getItem("cercle_friends")) ? JSON.parse(localStorage.getItem("cercle_friends")) : [];
	console.log( this.cercle_friends);
  }

  addCercleFriend() {
    let modal = this.modalCtrl.create('EventModalAddCerclePage',{name: null, friends: null, isedit: null});
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        let eventData = data;

        let events = this.cercle_friends;
        events.push(eventData);
        this.cercle_friends = [];
        setTimeout(() => {
          this.cercle_friends = events;
          localStorage.setItem("cercle_friends", JSON.stringify(this.cercle_friends));
        });
      }
    });
  }

  editCercleFriend(cercle_friend, i) {
	let tmp = JSON.parse(JSON.stringify(cercle_friend));
    let modal = this.modalCtrl.create('EventModalAddCerclePage',{name: tmp.name, friends: tmp.friends});
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        let eventData = data;

        let events = this.cercle_friends;
		events.splice(i, 1, eventData);
        this.cercle_friends = [];
        setTimeout(() => {
          this.cercle_friends = events;
          localStorage.setItem("cercle_friends", JSON.stringify(this.cercle_friends));
        });
      }
    });
  }

  removeCercleFriend(i) {
    this.cercle_friends.splice(i, 1);
    localStorage.setItem("cercle_friends", JSON.stringify(this.cercle_friends));
  }
}
