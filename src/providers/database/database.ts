import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class DatabaseProvider {

  fireDB: any;

  constructor() {
    this.fireDB = firebase.database();
  }

  addUserToDatabase(): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      try {
        firebase.auth().onAuthStateChanged( user => {
          if (user){
            console.log('Database Provider | firebase onAuthStateChanged | user : ', user);
            tmp.existsFirstLayer({table: 'users', userID: user.uid}).then(exists => {
              if(!exists) {
                tmp.fireDB.ref('users/' + user.uid).set({
                  uid: user.uid,
                  email: user.email,
                  photoURL: user.photoURL,
                  displayName: user.displayName
                });
              }
              resolve(user);
            }).catch(err => {
              console.log('Database Provider | Error on checking whether user exist on DB | err: ', err);
              reject(err);
            });
          } else {
            console.log('Database Provider | firebase onAuthStateChanged | NO USER');
            resolve(user);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Insert new item in database
   * @param {string} table          Table name
   * @returns {Promise<object>}
   */
  get(table): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      try {
        tmp.fireDB.ref(table).once('value')
          .then(snapshot => snapshot.val()).then(response => {
            resolve(response);
          });
      } catch(err) {
        reject(err);
      }
    });
  }

  /**
   * Insert new item in database
   * @param {object} params                Parameters
   * @param {string} params.table          Table name
   * @param {string} params.userID         User ID
   * @param {string} params.itemKey        Key of item to be deleted
   * @returns {Promise<object>}
   */
  delete(params): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      try {
        tmp.fireDB.ref(params.table + '/' + params.userID + '/' + params.itemKey).set(null);
        resolve()
      } catch(err) {
        reject(err);
      }
    });
  }

  /**
   * Insert new item in database
   * @param {object} params                Parameters
   * @param {string} params.table          Table name
   * @param {string} params.userID         User ID
   * @returns {Promise<object>}
   */
  getUserData(params) {
    return this.fireDB.ref('/' + params.table + '/' + params.userID);
  }

  /**
   * Insert new item in database
   * @param {object} params             Object containing parameters necessary to query
   * @param {string} params.table       Table name
   * @param {string} params.userID      User ID
   * @param {object} params.newData     Object to be saved
   * @returns {Promise<object>}
   */
  insert(params): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      try {
        /*
        // Push item w/out ID
        tmp.fireDB.ref().child(params.table).child(params.userID).push(params.newData);
        // Push item w/ ID
        let newItem = tmp.fireDB.ref().child(params.table).child(params.userID).push();
        params.newData.id = newItem.key;
        newItem.set(params.newData);
        */
        tmp.fireDB.ref().child(params.table).child(params.userID).child(params.newData.name).once('value', (snapshot) => {
          let exists = (snapshot.val() !== null);
          if(!exists) {
            // TODO : add item
            // Add another item as child
            tmp.fireDB.ref().child(params.table).child(params.userID).child(params.newData.name).set(params.newData);
            resolve();
          } else {
            reject('Item already exists');
          }
        });
      } catch(err) {
        console.log('Database Provider | Insert | err : ', err);
        reject(err);
      }
    });
  }

  /**
   * Insert new item in database
   * @param {object} params             Object containing parameters necessary to query
   * @param {string} params.reference   Reference ie 'table/userID/child'
   * @param {object} params.newData     Data to replace the old one
   * @returns {Promise<object>}
   */
  update(params): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      try {
        console.log('Database Provider | update | ref : ', params.reference, ' | data : ', params.newData);
        tmp.fireDB.ref(params.reference).update(params.newData);
        resolve();
      } catch(err) {
        console.log('Database Provider | Updating | err: ', err);
        reject(err);
      }
    });
  }

  /**
   * Insert new item in database
   * @param {object} params             Object containing parameters necessary to query
   * @param {string} params.table       Table name
   * @param {string} params.userID      User ID
   * @returns {Promise<object>}
   */
  existsFirstLayer(params): Promise<any> {
    let tmp = this;
    return new Promise(function (resolve, reject) {
      try {
        tmp.fireDB.ref().child(params.table).child(params.userID).once('value', (snapshot) => {
          let exists = (snapshot.val() !== null);
          resolve(exists);
        });
      } catch(err) {
        reject(err);
      }
    });
  }

}
