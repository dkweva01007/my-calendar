import { Injectable, Component } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { GooglePlus } from '@ionic-native/google-plus';

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

  constructor(public  http : Http, private googlePlus: GooglePlus) {}
  
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
      'path': 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      'method': 'GET',
      'params': {
        'key': 'AIzaSyCG5CWzIexkOJpEfhjEfkp7VqKjD6mDi4A'
      },
      'headers': {
        'Authorization': 'Bearer ' + token
      }
    })
    .execute(function(resp) {
      console.log('GAPI REs : ', resp);
    });

  }

  login(): Promise<any> {
	let tmp = this;
    return new Promise(function (resolve, reject) {
      tmp.googlePlus.login({
        'scopes': 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly',
        'webClientId': '235375545183-c9r6vgbgl2k3sh8rf3vd62s9vpbhlvb4.apps.googleusercontent.com',
        'offline':true,
      })
      .then(res => {
        let users = JSON.parse(localStorage.getItem("gToken"));
        users.push(res);
        localStorage.setItem("gToken", JSON.stringify(users));
        gapi.load('client', tmp.startGAPI(res.accessToken));
       
		
        resolve(res);
      })
      .catch(err => {reject(err);});
	});
  }
}
