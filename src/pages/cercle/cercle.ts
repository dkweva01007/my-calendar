import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { DatabaseProvider } from "../../providers/database/database";
import { AuthProvider } from '../../providers/auth/auth';
import {EventModalAddCerclePage} from "../event-modal-add-cercle/event-modal-add-cercle";

@Component({
  selector: 'page-cercle',
  templateUrl: 'cercle.html',
})
export class CerclePage {

  myIndex: number;
  cercle_friends: any;
  userCircles: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
              private fireDB: DatabaseProvider, private auth: AuthProvider, private alertCtrl: AlertController) {
    this.myIndex = navParams.data.tabIndex || 0;
    this.showAllCircles();
  }

  ionViewDidLoad() {
    this.cercle_friends = JSON.parse(localStorage.getItem("cercle_friends")) ? JSON.parse(localStorage.getItem("cercle_friends")) : [];
	  console.log(this.cercle_friends);
  }

  showAllCircles() {
    this.userCircles = [];
    this.fireDB.get('circle/' + this.auth.getCurrentUser().uid).then(circles => {
      circles = Object.keys(circles).map(key=>circles[key]);
      console.log('Circle Page | Recover data |  circles : ', circles);
      for(let circle of circles) {
        this.addCircle(circle);
      }
    }).catch(err => {
      console.log('Circle Page | Recover data | error : ', err);
    })
  }

  addCircle(circle) {
    console.log('Circle Page | addCircle | circle : ', circle);
    let item = {
      name: circle.name,
      calendarID: circle.calendarID,
      members: Object.keys(circle.members).map(key => {
        return Object.assign({uid: key}, circle.members[key])
      })
      //members: Object.keys(circle.members).map(key=>circle.members[key])
    };
    console.log('!this.userCircles.includes(item) : ', !this.userCircles.includes(item));
    if(!this.userCircles.includes(item)) {
      console.log('add circle to current circles ');
      this.userCircles.push(item);
    }
  }

  selectCircle(circle) {
    let modal = this.modalCtrl.create('EventModalAddCerclePage', {selectedCircle: circle});
    modal.present();
    modal.onDidDismiss(params => {
      console.log('Circle Page | closed modal');
      this.showAllCircles();
    });
  }

  /////////////////////////////

  addCercleFriend() {
    let modal = this.modalCtrl.create('EventModalAddCerclePage',{name: null, friends: null, isedit: null});
    modal.present();
    modal.onDidDismiss(data => {
      this.showAllCircles();
    });
  }

}
