import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthProvider } from '../../providers/auth/auth';
import * as firebase from "firebase";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginError: string;

  // TODO: move silent login here
  // TODO: create auth service by following: https://medium.com/appseed-io/integrating-firebase-password-and-google-authentication-into-your-ionic-3-app-2421cee32db9

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController,
              private auth: AuthProvider) {
    this.menuCtrl.enable(false, 'myMenu');
    let user = firebase.auth().currentUser;
    console.log('LoginPage | user: ', user);
    this.auth.silentLogin().then(() => {
      console.log('LoginPage | logged in silently');
      this.navCtrl.setRoot(HomePage);
      this.navCtrl.popToRoot();
    }).catch(err => { console.log('LoginPage | Not able to launch silent login') });
  }

  login() {
    this.auth.login()
      .then(() => {
        console.log('LoginPage | Successfully logged in');
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
      })
      .catch(err => this.loginError = JSON.stringify(err));
  }

}
