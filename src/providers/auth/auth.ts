import { Injectable } from '@angular/core';
import { GHttpProvider } from '../../providers/g-http/g-http';
import { DatabaseProvider } from '../../providers/database/database';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthProvider {

  currentUser: any;

  constructor(private gHttpProvider: GHttpProvider, private storage: Storage, private database: DatabaseProvider) {
    // TODO : catch cut connection to firebase database, once connected again, save all events via google calendar API
    console.log('Auth Provider | add user to database');
    this.database.addUserToDatabase().then(loggedUser => {
      this.currentUser = loggedUser;
      console.log('Auth Provider | changing current user to : ', this.currentUser);
    }).catch(err => console.log('Auth Provider | Firebase logged in | err updating currentUser : ', err));
  }

  getCurrentUser() {
    return this.currentUser;
  }

  silentLogin(): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      tmp.gHttpProvider.silentLogin()
        .then(res => {
          tmp.loginAction(res, resolve, reject);
        });
    });
  }

  login(): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      tmp.gHttpProvider.login().then(res => {
        tmp.loginAction(res, resolve, reject);
      }).catch(err => {reject(err);});
    });
  }

  loginAction(res, resolve, reject) {
    const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
    firebase.auth().signInWithCredential(googleCredential)
      .then( response => {
        console.log("Auth Provider | loginAction | response : ", response);
        if(resolve) {
          this.addUserToStorage(res, resolve, reject);
        }
      }).catch(err => {
        console.log('Auth Provider | loginAction err: ', err);
        if(reject) {
          reject(err);
        }
    });
  }

  addUserToStorage(res, resolve, reject) {
    let tmp = this;
    tmp.storage.get('userAccounts').then((userAccounts) => {
      tmp.storage.set('currentUserGoogleAccount', JSON.stringify(res));
      userAccounts = JSON.parse(userAccounts);
      console.log('this is userAccounts : ', userAccounts);
      // If already logged in, replace account; else, add in account array
      if(userAccounts !== null && userAccounts.some(account => account.email === res.email)) {
        let currentAccountIndex = userAccounts.findIndex(account => account.email === res.email);
        userAccounts[currentAccountIndex] = res;
        tmp.storage.set('userAccounts', JSON.stringify(userAccounts));
      } else {
        if(userAccounts === null)
          userAccounts = [];
        userAccounts.push(res);
        tmp.storage.set('userAccounts', JSON.stringify(userAccounts));
      }
      resolve(res);
    }).catch(err => {reject(err);});
  }

  logout(): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      tmp.gHttpProvider.logout().then(() => {
        firebase.auth().signOut().then(() => {
          console.log('Auth Provider | Firebase logout | Success : ');
          resolve()
        }).catch((err => {
          console.log('Auth Provider | Firebase logout | Fail err : ', err);
          reject(err);
        }))
      }).catch(err => reject(err));
    });
  }

}
