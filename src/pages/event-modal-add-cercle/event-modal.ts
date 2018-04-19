import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as moment from 'moment';

/**
 * Generated class for the EventModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-modal-add-cercle',
  templateUrl: 'event-modal-add-cercle.html',
})
export class EventModalAddCerclePage {

  title: any;
  friends: any;
  cercle_friend= {}

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.cercle_friend.title = this.navParams.get('titles');
    this.cercle_friend.friends = this.navParams.get('friends');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }
 
  save() {
    this.viewCtrl.dismiss(this.cercle_friend);
  }

}
