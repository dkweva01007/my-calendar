import { Injectable } from '@angular/core';
import { GHttpProvider } from '../../providers/g-http/g-http';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthProvider {

  constructor(private gHttpProvider: GHttpProvider, private storage: Storage) {
    firebase.auth().onAuthStateChanged( user => {
      if (user){
        console.log('Auth Provider | firebase onAuthStateChanged | user : ', user);
        firebase.database().ref().child('users').child(user.uid).once('value', (snapshot) => {
          let exists = (snapshot.val() !== null);
          if(!exists) {
            firebase.database().ref('users/' + user.uid).set({
              email: user.email,
              photoURL: user.photoURL,
              displayName: user.displayName
            });
          }
        });
      } else {
        console.log('Auth Provider | firebase onAuthStateChanged | NO USER');
      }
    });
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
