import { Injectable, Component } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { GooglePlus } from '@ionic-native/google-plus';
import { Storage } from '@ionic/storage';

declare var gapi: any;

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

  login(): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      tmp.googlePlus.login({
        'scopes': 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly',
        'webClientId': tmp.googleInfo.webClient.ID,
        'offline':true,
      })
        .then(res => {
          tmp.storage.set('userGoogleInfo', JSON.stringify(res));
          let users = JSON.parse(localStorage.getItem("gToken"));
          users.push(res);
          localStorage.setItem("gToken", JSON.stringify(users));
          gapi.load('client');
          resolve(res);
        })
        .catch(err => {reject(err);});
    });
  }
  getMyCalendarEvents(): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      let user = JSON.parse(localStorage.getItem("gToken"));
      console.log(' getMyCalendarEvents user : ', user);
      resolve(user);
      /*
      tmp.googlePlus.login({
        'scopes': 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly',
        'webClientId': '235375545183-c9r6vgbgl2k3sh8rf3vd62s9vpbhlvb4.apps.googleusercontent.com',
        'offline':true,
      })
        .then(res => {
          let users = JSON.parse(localStorage.getItem("gToken"));
          users.push(res);
          localStorage.setItem("gToken", JSON.stringify(users));
          resolve(res);
        })
        .catch(err => {reject(err);});
        */
    });

  }

}
