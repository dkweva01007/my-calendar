import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as firebase from "firebase";
import 'rxjs/add/operator/debounceTime';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-event-modal-add-cercle',
  templateUrl: 'event-modal-add-cercle.html',
})
export class EventModalAddCerclePage {

  contact = {};
  isedit = -1;
  cercle_friend = {name: "Nouveau Cercle", friends:[]};

  errorMsg: string = undefined;
  users: any;
  circleName: string = 'Nouveau Cercle';
  usersOriginal: any;
  usersSelected: any;
  searchTerm: string = '';
  searchControl: FormControl;
  searching: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              private fireDB: DatabaseProvider, private auth: AuthProvider) {
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.cercle_friend = {
      name: this.navParams.get('name') != null ? this.navParams.get('name') : "Nouveau Cercle",
      friends: this.navParams.get('friends') != null ? this.navParams.get('friends') : []
    };
    this.contact = {name: null, email: null};
    this.isedit = -1;

    this.fireDB.get('users').then(users => {
      console.log('Event Modal Add Cercle | Retrieve users | users: ', users);
      this.usersOriginal = Object.keys(users).map(i => users[i]);
      this.setFilteredUsers();
      this.errorMsg = undefined;
      this.usersSelected = [];
    }).catch(err =>
      console.log('Event Modal Add Cercle | Retrieve users | Err: ', err)
    );

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredUsers();
    });
  }

  onSearchInput(){
    this.searching = true;
  }

  setFilteredUsers() {
    this.users = this.usersOriginal.filter((user) => {
      return user.displayName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    })
  }

  selectUser(selectedUser) {
    if(!this.usersSelected.includes(selectedUser)) {
      this.usersSelected.push(selectedUser);
    }
  }

  unselectUser(index) {
    this.usersSelected.splice(index, 1);
  }

  save() {
    if(!this.circleName || this.circleName.trim().length === 0) {
      this.errorMsg = 'Circle titles is required.';
    } else if (this.usersSelected.length === 0) {
      this.errorMsg = 'At least 1 user should be added to create a circle.';
    } else {
      this.fireDB.insert({
        table: 'circle',
        userID: this.auth.getCurrentUser().uid,
        newData: {
          name: this.circleName,
          members: this.usersSelected.reduce((obj, user) => (
            obj[user.uid] = {email: user.email, displayName: user.displayName}, obj
          ) ,{})
        }
      }).then(() => this.viewCtrl.dismiss()).catch(err => {
        console.log('Event Modal Add Circle | Save | Err : ', err);
        this.errorMsg = err;
      });
    }
  }

  //////////////

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

  saveCercle() {
    this.viewCtrl.dismiss(this.cercle_friend);
  }

}
