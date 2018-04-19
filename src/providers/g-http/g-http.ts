import { Injectable, Component } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { GooglePlus } from '@ionic-native/google-plus';
import { Storage } from '@ionic/storage';

declare var gapi: any;

/*
  Generated class for the GHttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
@Component({
  providers: [GooglePlus]
})
export class GHttpProvider {
  headers = new Headers({ 'Content-Type': 'application/json' });
  googleInfo : any = {
    apiKey: 'AIzaSyC6sDU3l5ErNqSDMTzbzUBceFkm-mj2Y3g',
    webClient: {
      ID: '235375545183-c9r6vgbgl2k3sh8rf3vd62s9vpbhlvb4.apps.googleusercontent.com',
      secret: 'YzJAVSla2y-HImVCJ-ELvedv',
      redirect_uri: 'https://my-calendar-app-6721a.firebaseapp.com'
    }
  };

  constructor(public  http : Http, private googlePlus: GooglePlus, private storage: Storage) {}

  get(url, token){
    if (token !== null)
       this.headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers: this.headers });
    this.http.get(url, options).toPromise().then(
      data => {
        return JSON.parse( data['_body']);
      },error => {
        return null;
      }
    );
  }

  post(url, postParams, token){
    if (token !== null)
       this.headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers: this.headers });
    this.http.post(url, postParams, options).subscribe(data => {
      return JSON.parse( data['_body']);
    }, error => {
        return null;
    });
  }

  put(url, putParams, token){
    if (token !== null)
       this.headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers: this.headers });
    this.http.put(url, putParams, options).subscribe(data => {
      return JSON.parse( data['_body']);
    }, error => {
        return null;
    });
  }

  delete(url, token){
    if (token !== null)
       this.headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers: this.headers });
    this.http.delete(url, options).subscribe(data => {
      return JSON.parse( data['_body']);
    }, error => {
        return null;
    });
  }

  startGAPI(token) {

    gapi.client.request({
      'path': 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      'method': 'GET',
      'params': {
        'key': this.googleInfo.apiKey
      },
      'headers': {
        'Authorization': 'Bearer ' + token
      }
    })
    .execute(function(resp) {
      console.log('Calendar events test REs : ', resp);
    });

  }

  login(): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      tmp.googlePlus.login({
        'scopes': 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly',
        'webClientId': tmp.googleInfo.webClient.ID,
        'offline':true,
      }).then(res => {
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
          gapi.load('client');
          resolve(res);
        }).catch(err => {reject(err);});
      }).catch(err => {reject(err);});
    });
  }
  getMyCalendarEvents(): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      tmp.storage.get('currentUserGoogleAccount').then((currentUserGoogleAccount) => {
        currentUserGoogleAccount = JSON.parse(currentUserGoogleAccount);
        console.log('getMyCalendarEvents | currentUserGoogleAccount : ' , currentUserGoogleAccount);
        gapi.client.request({
          'path': 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          'method': 'GET',
          'params': {
            'key': tmp.googleInfo.apiKey,
            'calendarId': 'primary'
          },
          'headers': {
            'Authorization': 'Bearer ' + currentUserGoogleAccount.accessToken
          }
        }).execute(function(resp) {
          console.log('Calendar res events : ', resp);
          resolve(resp);
        });
      }).catch(err => {reject(err);});


      /*
      tmp.googlePlus.login({
        'scopes': 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly',
        'webClientId': '235375545183-c9r6vgbgl2k3sh8rf3vd62s9vpbhlvb4.apps.googleusercontent.com',
        'offline':true
      })
        .then(res => {
          let users = JSON.parse(localStorage.getItem("gToken"));
          users.push(res);
          localStorage.setItem("gToken", JSON.stringify(users));
          gapi.load('client', tmp.startGAPI(res.accessToken));
          resolve(res);
        })
        .catch(err => {reject(err);});
        */
    });

  }

}
