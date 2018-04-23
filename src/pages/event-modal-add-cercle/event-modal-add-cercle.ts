import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import * as firebase from "firebase";
import 'rxjs/add/operator/debounceTime';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';
import { GHttpProvider } from '../../providers/g-http/g-http';

@IonicPage()
@Component({
  selector: 'page-event-modal-add-cercle',
  templateUrl: 'event-modal-add-cercle.html',
})
export class EventModalAddCerclePage {

  contact = {};
  isedit = -1;
  cercle_friend = {name: "Nouveau Cercle", friends:[]};

  editMode:boolean = false;
  errorMsg: string = undefined;
  users: any;
  circleName: string = 'Nouveau Cercle';
  calendarID: any;
  usersOriginal: any;
  usersSelected: any;
  searchTerm: string = '';
  searchControl: FormControl;
  searching: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              private fireDB: DatabaseProvider, private auth: AuthProvider, private alertCtrl: AlertController, private gHttpProvider: GHttpProvider) {
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.cercle_friend = {
      name: this.navParams.get('name') != null ? this.navParams.get('name') : "Nouveau Cercle",
      friends: this.navParams.get('friends') != null ? this.navParams.get('friends') : []
    };
    this.contact = {name: null, email: null};
    this.isedit = -1;

    this.usersSelected = [];
    if(!this.navParams.get('selectedCircle')) {
      this.editMode = false;
    } else {
      this.editMode = true;
      let selectedCircle = this.navParams.get('selectedCircle');
      this.circleName = selectedCircle.name;
      this.calendarID = selectedCircle.calendarID;
      for (let member of selectedCircle.members) {
        this.usersSelected.push(member);
      }
    }

    // Fill users search array
    this.fireDB.get('users').then(users => {
      console.log('Event Modal Add Cercle | Retrieve users | users: ', users);
      this.usersOriginal = Object.keys(users).map(i => users[i]);
      this.setFilteredUsers();
      this.errorMsg = undefined;
    }).catch(err =>
      console.log('Event Modal Add Cercle | Retrieve users | Err: ', err)
    );

    // Listen to search bar
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
    console.log('selectedUser', selectedUser);
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
      if(this.editMode) {
        this.updateCircle();
      } else {
        this.insertCircle();
      }
    }
  }

  insertCircle() {
    this.gHttpProvider.queryGoogle({
      method: 'POST', body: { 'summary': this.circleName },
      URI: 'https://www.googleapis.com/calendar/v3/calendars'
    }).then(savedCalendar => {
      this.fireDB.insert({
        table: 'circle',
        userID: this.auth.getCurrentUser().uid,
        newData: {
          name: this.circleName,
          calendarID: savedCalendar.id,
          members: this.usersSelected.reduce((obj, user) => (
            obj[user.uid] = {email: user.email, displayName: user.displayName}, obj
          ) ,{})
        }
      }).then(() => this.viewCtrl.dismiss()).catch(err => {
        console.log('Event Modal Add Circle | Save | Err : ', err);
        this.errorMsg = err;
      });
    }).catch(err => console.error('Event Modal Circle | Insert Circle | Create Calendar | err:  ', err));
  }

  updateCircle() {
    console.log('Event add circle modal | updating circle .. ');
    this.fireDB.update({
      reference: 'circle/' + this.auth.getCurrentUser().uid + '/' + this.circleName,
      newData: {
        name: this.circleName,
        members: this.usersSelected.reduce((obj, user) => (
          obj[user.uid] = {email: user.email, displayName: user.displayName}, obj
        ) ,{})
      }
    }).then(() => {
      console.log('Event add circle modal | updating circle | Success');
      this.viewCtrl.dismiss()
    }).catch(err => {
      console.log('Event Modal Add Circle | Edit | Err : ', err);
      this.errorMsg = err;
    });
  }

  delete() {
    let alert = this.alertCtrl.create({
      title: 'Confirm deletion',
      message: 'Are you sure you want to delete this circle?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.gHttpProvider.queryGoogle({
              method: 'DELETE',
              URI: 'https://www.googleapis.com/calendar/v3/calendars/'+ this.calendarID
            }).then(savedCalendar => {
              this.fireDB.delete({
                table: 'circle', itemKey: this.circleName,
                userID: this.auth.getCurrentUser().uid
              }).then(() => {
                this.viewCtrl.dismiss();
              }).catch(err => {
                console.log('Event Add Circle Modal | Delete | err: ', err);
                this.errorMsg = JSON.stringify(err);
              })
            }).catch(err => console.error('Event Modal Circle | Delete Circle | Delete Calendar | err:  ', err));
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

