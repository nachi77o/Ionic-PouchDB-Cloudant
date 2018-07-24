import { Injectable, NgZone } from '@angular/core';
import PouchDB from 'pouchdb';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  data: any;
  db: any;
  username: any;
  password: any;
  remote: any; 

  constructor(public zone: NgZone) {
 
    this.db = new PouchDB('xxxxxxxxxx');
    this.username = 'xxxxxxxxxxx-bluemix';
    this.password = 'xxxxxxxxxxxxxx';
    this.remote = 'https://xxxxxxxxx-bluemix.cloudant.com/xxxxxxxxxxxxx';
 
    let options = {
      live: true,
      retry: true,
      continuous: true,
      auth: {
        username: this.username,
        password: this.password
      }
    };
 
    this.db.sync(this.remote, options);
 
  }
 
  addDocument(doc){
    this.db.put(doc);
  }
 
  getDocuments(){
 
    return new Promise(resolve => {
 
      this.db.allDocs({
 
        include_docs: true
 
      }).then((result) => {
 
        this.data = [];
 
        let docs = result.rows.map((row) => {
          this.data.push(row.doc);
          resolve(this.data);
        });
 
        this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          this.handleChange(change);
        });
 
      }).catch((error) => {
 
        console.log(error);
 
      });
 
    });
 
  }
 
  handleChange(change){
 
    this.zone.run(() => {
 
      let changedDoc = null;
      let changedIndex = null;
 
      this.data.forEach((doc, index) => {
 
        if(doc._id === change.id){
          changedDoc = doc;
          changedIndex = index;
        }
 
      });
 
      //A document was deleted
      if(change.deleted){
        this.data.splice(changedIndex, 1);
      }
      else {
 
        //A document was updated
        if(changedDoc){
          this.data[changedIndex] = change.doc;
        }
        //A document was added
        else {
          this.data.push(change.doc);       
        }
 
      }
 
    });
 
  }

}
