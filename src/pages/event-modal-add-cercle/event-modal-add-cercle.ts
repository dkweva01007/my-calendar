import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-event-modal-add-cercle',
  templateUrl: 'event-modal-add-cercle.html',
})
export class EventModalAddCerclePage {

  cercle_friend = {name: "Nouveau Cercle", friends:[]};
  contact = {};
  isedit = -1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    this.cercle_friend = {
      name: this.navParams.get('name') != null ? this.navParams.get('name') : "Nouveau Cercle",
      friends: this.navParams.get('friends') != null ? this.navParams.get('friends') : []
    };
    this.contact = {name: null, email: null}
    this.isedit = -1;
  }

  addContact() {
    if(this.isedit > -1){
      this.cercle_friend.friends.splice(this.isedit, 1, this.contact);
      this.contact = {name: null, email: null};
	  this.isedit = -1;
    }else{
      this.cercle_friend.friends.push(this.contact);
      this.contact = {name: null, email: null};
    }
  }


  editContact(contact, i) {
    this.contact = contact;
	this.isedit = i;
  }

  removeContact(i) {
    this.cercle_friend.friends.splice(i, 1);
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  save() {
    this.viewCtrl.dismiss(this.cercle_friend);
  }

}
