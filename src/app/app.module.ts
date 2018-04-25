import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GooglePlus } from '@ionic-native/google-plus';
import { HttpModule} from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MenuPage } from '../pages/menu/menu';
import { CalendarPage } from '../pages/calendar/calendar';
import { CerclePage } from '../pages/cercle/cercle';
import { LoginPage } from '../pages/login/login';
import { WeatherPage } from '../pages/weather/weather';

import { NgCalendarModule  } from 'ionic2-calendar';
import { GHttpProvider } from '../providers/g-http/g-http';
import { IonicStorageModule } from '@ionic/storage';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { AuthProvider } from '../providers/auth/auth';
import { DatabaseProvider } from '../providers/database/database';
import { WeatherInfoProvider } from '../providers/weather/open-weather-map';

const config = {
  apiKey: 'AIzaSyCG5CWzIexkOJpEfhjEfkp7VqKjD6mDi4A',
  authDomain: 'my-calendar-app-6721a.firebaseapp.com',
  databaseURL: 'https://my-calendar-app-6721a.firebaseio.com',
  projectId: 'my-calendar-app-6721a',
  storageBucket: 'my-calendar-app-6721a.appspot.com',
  messagingSenderId: '235375545183'
};

firebase.initializeApp(config);
const pages = [
  MyApp,
  HomePage,
  MenuPage,
  CalendarPage,
  CerclePage,
  LoginPage,
  WeatherPage
];
@NgModule({
  bootstrap: [IonicApp],
  declarations: pages,
  entryComponents: pages,
  imports: [
	  NgCalendarModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config),
    HttpModule
  ],
  providers: [
    GooglePlus,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GHttpProvider,
    AngularFireAuth,
    AuthProvider,
    DatabaseProvider,
    WeatherInfoProvider
  ]
})
export class AppModule {}
