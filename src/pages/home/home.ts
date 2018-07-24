import { Component } from '@angular/core';
import { DataProvider } from '../../providers/data/data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 
  items: any;
 
  constructor(public dataService: DataProvider) {
 
  }
 
  ionViewDidLoad(){
 
      this.items = [];
 
      this.dataService.getDocuments().then((result) => {
        this.items = result;
      });
 
  }
 
  addData(){
 
    let date = new Date();
 
    let newDoc = {
      '_id': date,
      'message': date.getTime()
    };
 
    this.dataService.addDocument(newDoc);
  }

  
 
}