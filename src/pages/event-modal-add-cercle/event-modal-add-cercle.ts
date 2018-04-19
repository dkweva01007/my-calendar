import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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

  cercle_friend= {name: "", friends: []}
  contact= {name: null, email: null}

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.cercle_friend.name = this.navParams.get('name') != null ? this.navParams.get('name') : "Nouveau Cercle";
    this.cercle_friend.friends = this.navParams.get('friends') != null ? this.navParams.get('friends') : [] ;
  }

  cancel() {
    this.viewCtrl.dismiss();
  }
 
  save() {
    this.viewCtrl.dismiss(this.cercle_friend);
  }

}
