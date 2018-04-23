import { Injectable, Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { GooglePlus } from '@ionic-native/google-plus';
import { Storage } from '@ionic/storage';

declare let gapi: any;

@Injectable()
@Component({
  providers: [GooglePlus]
})
export class GHttpProvider {
  headers = new Headers({ 'Content-Type': 'application/json' });
  googleInfo : any = {
    scopes: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly',
    apiKey: 'AIzaSyC6sDU3l5ErNqSDMTzbzUBceFkm-mj2Y3g',
    webClient: {
      ID: '235375545183-c9r6vgbgl2k3sh8rf3vd62s9vpbhlvb4.apps.googleusercontent.com',
      secret: 'YzJAVSla2y-HImVCJ-ELvedv',
      redirect_uri: 'https://my-calendar-app-6721a.firebaseapp.com',
      redirect_urii: 'http://localhost:8100/'
    }
  };

  constructor(public  http : Http, private googlePlus: GooglePlus, private storage: Storage) {}

  silentLogin(): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      console.log('Google Provider | Calling silentLogin..');
      tmp.googlePlus.trySilentLogin({
        'scopes': tmp.googleInfo.scopes,
        'webClientId': tmp.googleInfo.webClient.ID,
        'offline': false,
      }).then(res => {
        console.log('Google Provider | Success | res: ', res);
        gapi.load('client');
        resolve(res);
      }).catch(err => {
        console.log('Google Provider | Fail | err: ', err);
        reject(err);
      });
    });
  }

  login(): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      console.log('Google Provider | Calling login..');
      tmp.googlePlus.login({
        'scopes': tmp.googleInfo.scopes,
        'webClientId': tmp.googleInfo.webClient.ID,
        'offline':true,
      }).then(res => {
        console.log('Google Provider | Success | res: ', res);
        gapi.load('client');
        resolve(res);
      }).catch(err => {
        console.log('Google Provider | Fail | err: ', err);
        reject(err);
      });
    });
  }

  logout(): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      console.log('Google Provider | Calling logout..');
      tmp.googlePlus.logout().then(res => {
        console.log('Google Provider | Success | res: ', res);
        resolve();
      }).catch(err => {
        console.log('Google Provider | Fail | err: ', err);
        reject(err);
      });
    });
  }

  /**
   * Flexible query function to Google API using gapi.client
   * @param {object} params             Object containing parameters necessary to query
   * @param {string} params.method      GET | POST | PATCH | DELETE
   * @param {string} params.URI         URI path to query
   * @param {object} params.params      Query parameters
   * @param {object} params.body        Query request body
   * @returns {Promise<object>}         Response from Google API
   */
  queryGoogle(params): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      tmp.storage.get('currentUserGoogleAccount').then((currentUserGoogleAccount) => {
        currentUserGoogleAccount = JSON.parse(currentUserGoogleAccount);
        let queryParams = {
          'key': tmp.googleInfo.apiKey
        };
        if(params.params)
          Object.assign(queryParams, params.params);
        let request = {
          'path': params.URI,
          'method': params.method,
          'params': queryParams,
          'headers': {
            'Authorization': 'Bearer ' + currentUserGoogleAccount.accessToken
          }
        };
        if(params.body)
          request['body'] = params.body;
        gapi.client.request(request).execute(function(response) {
          console.log('Google query response : ', response);
          if(response === undefined || !response.hasOwnProperty('error')) {
            resolve(response);
          } else {
            if(response.error.hasOwnProperty('message') && response.error.message === "Invalid Credentials") {
              console.log('Invalid token, calling silent login..');
              tmp.silentLogin().then(() => {
                gapi.client.request(request).execute(function(response) {
                  console.log('Google query response : ', response);
                  resolve(response);
                });
              });
            }
          }
        });
      }).catch(err => {reject(err);});
    });
  }

  // NOT WORKING
  refreshAccessToken(): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      tmp.storage.get('currentUserGoogleAccount').then((currentUserGoogleAccount) => {
        currentUserGoogleAccount = JSON.parse(currentUserGoogleAccount);
        console.log('refreshAccessToken | currentUserGoogleAccount : ' , currentUserGoogleAccount);
        tmp.http.post(
          'https://www.googleapis.com/oauth2/v4/token',
          {
            client_id: tmp.googleInfo.apiKey,
            client_secret: tmp.googleInfo.webClient.secret,
            grant_type: "authorization_code",
            redirect_uri: tmp.googleInfo.webClient.redirect_urii,
            code: currentUserGoogleAccount.serverAuthCode,
          },
          {
            headers : new Headers({'Content-Type':'application/x-www-form-urlencoded;charset=utf-8;'})
          }
        ).subscribe(
          data =>
          {
            console.log('refreshToken data : ', data);
            resolve(data);
          },
          error => {
            console.log('refreshToken error : ', error);
            reject(error);
          });
      }).catch(err => {reject(err);});
    });
  }

}
