
//REQUIRED DEPENDENCIES AND LIBRARIES
import { Component } from '@angular/core';
import { ActionSheetController, Platform, NavController } from 'ionic-angular';
import { FilePath } from '@ionic-native/file-path';
import { Transfer } from '@ionic-native/transfer';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import getPixels from "get-pixels";
import { FirebaseDatabase } from '../../classes/FirebaseDatabase';
import { FirebaseStorage } from '../../classes/FirebaseStorage';
import { DatabaseHandler } from '../../classes/DatabaseHandler';
import { LocationHandler } from '../../classes/LocationHandler';
import { DirectoryHandler } from '../../classes/DirectoryHandler';
import { UiProvider } from '../../providers/ui/ui';
import { Dates } from '../../classes/Dates';

declare var cordova: any;
declare var firebase: any;

//COMPONENT
@Component({
  selector: 'page-process',
  templateUrl: 'process.html'
})
 
//CLASS
export class ProcessPage {

  //VARIABLE
  firebaseDatabaseObject = FirebaseDatabase.getInstance();
  firebaseStorageObject = FirebaseStorage.getInstance();
  databaseObject = DatabaseHandler.getInstance();
  locationObject = LocationHandler.getInstance();
  directoryObject = DirectoryHandler.getInstance();
  datesObject = Dates.getInstance();
  lastImage: string = null;
  currentImage: string = null;
  ntu:number = 0;
  dataDatabase:string = 'null';
  log: string = 'null';
  datafirebase:string = 'null';
  storage:string = 'null';
  blobb;


  //CONSTRUCTOR
  constructor(public navCtrl: NavController, private camera: Camera, private transfer: Transfer, 
              private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, 
              public platform: Platform, public uiProvider: UiProvider) { 
                //this.directoryObject.createDirectory();
                //this.databaseObject.createTableResult();
                //this.databaseObject.createTableUser();
              }

  public updateLog() {
    this.dataDatabase = this.dataDatabase + this.databaseObject.getLog();
    this.storage = this.storage + this.firebaseStorageObject.getLog();
    this.log = this.log + this.directoryObject.getLog();
  }
  
  public download() {
    var fileName = '1517668755060.jpg';
    this.log = this.log + ', passed download ,';
    this.dowloadImage(fileName);
  }

  public downloadD() {
    this.log = this.log + ', passed downloadD ,';
    this.log = this.log + 'blob check: ' + this.blobb;
    this.createFile();
  }

  public dowloadImage(fileName) {
    var blob = null;
    var date = new Date();
    this.log = this.log + ', dowloadImage(fileName) passed ,';

    firebase.storage().ref('Water Turbidity Meter/Images').child('' + fileName).getDownloadURL().then(function(url) {
      console.log(url);
      var t = date.getTime();
      console.log('date 1: ' + t);
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.open('GET', url, true);

      xhr.onload = function(event) {
        blob = xhr.response;
        console.log('DONE: ' + xhr.status);
        console.log('DONE: ' + xhr.readyState);

        if(blob){ 
          console.log('blob is not empty');
          var date = new Date();
          var d = date.getTime();
          console.log('date 2: ' + d);
          var dif = d-t;
          console.log('diffrent: ' + dif);
        }
      };
 
      xhr.send();
    }).catch(function(error) {
      console.log('Download failed');
    });

    setTimeout(function () {
      this.blobb = blob;
      console.log('blob ori: ' + this.blobb);
      this.log = this.log + 'blob ori: ' + this.blobb;
    }, 10000);
  }

  public createFile() {
    this.log = this.log + ', Passed createfile ,' + this.blobb;
    /*this.directoryObject.getFile().createFile(this.directoryObject.getPath(), 'saje.jpg', true).then(() => {
      this.log = this.log + ', File create done ,';

      this.directoryObject.getFile().writeFile(this.directoryObject.getPath(), 'saje.jpg', this.blobb, {replace: true}).then(() => {
        this.log = this.log + ', File write done ,';
      }).catch((err) => {
        this.log = this.log + ', File write error ,';
      });

    }).catch((err) => {
      this.log = this.log + ', File create error ,';
    });*/
    
  }

  public pullDataFromFirebase() : number[] { 
    this.log = this.log + ', Entering pullDataFromFirebase() ,';
    var arrResult: number[];
    arrResult.push(1111);

    /*var loading = this.loadingCtrl.create({
      content: 'Firebase Loading...',
    });
    loading.present();

    
    
    firebase.database().ref('result').once('value').then(function(snap) {
      var arrResult: number[];
      arrResult.push(1111);
        if(snap.val()){
          loading.dismissAll();
          arrResult.push(snap.val().key);
          return arrResult;
        } else {
          arrResult.push(0);
        }
    }, function(error) {});*/

    /*
    firebase.database().ref('result').once('value').then(function(snapshot) { snapshot.forEach(function(childSnapshot) {
      
      if(childSnapshot.val()){
        loading.dismissAll();
        arrResult.push(childSnapshot.key);
        return arrResult;
      } else {
        arrResult.push('empty bohh');
        return arrResult;
      }
    }, function(error) {
      var error2 = JSON.stringify(error);
      this.log = this.log + ', error pull child: ' + error2;
    })}, function(error) {
      var error2 = JSON.stringify(error);
      this.log = this.log + ', error pull parent: ' + error2;
    });*/
    //loading.dismissAll();
    this.log = this.log + ', Exiting pullDataFromFirebase() ,';
    return arrResult;
  }


  /** 
   * Method Name   : presentActionSheet()
   * Purpose       : to display action sheet that allows user to choose options whether to capture image using 
   *                 camera or select image from gallery 
   * Trigger when  : clicked "Please Select Image" Button
  **/
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }


  /** 
   * Method Name   : takePicture(sourceType)
   * Purpose       : to capture picture of water using phone camera or to choose picture from Gallery
   * Trigger when  : invoked by presentActionSheet()
  **/
  public takePicture(sourceType) {
    //Create loading
    var loading = this.uiProvider.createLoading('Image Loading...');
    loading.present();

    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }

      loading.dismissAll();
      this.uiProvider.presentToast('Image succesful selected.');
      
    }, (err) => {
      loading.dismissAll();
      this.uiProvider.presentToast('Error while selecting image.');
    });
  }


  /** 
   * Method Name   : createFileName()
   * Purpose       : to rename captured image (image from Camera) / to rename selected image (image from Gallery)
   * Trigger when  : invoked by takePicture(sourceType)
  **/
  public createFileName() {
    var date = this.datesObject.getDates();
    this.locationObject.getLatitude();
    this.locationObject.getLongitude();
    return date + '.jpg';
  }

  
  /** 
   * Method Name   : copyFileToLocalDir(namePath, currentName, newFileName)
   * Purpose       : to copy image file to Application Directory
   * Trigger when  : invoked by takePicture(sourceType)
  **/
  public copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.directoryObject.getPath(), newFileName).then(success => {
      this.lastImage = this.directoryObject.pathForImage();
    }, error => {
      this.uiProvider.presentToast('Error while storing image');
    });
  }


  /** 
   * Method Name   : calculate()
   * Purpose       : to calculate NTU of image
   * Trigger when  : clicked "Start" Button
  **/  
  public calculate() {
    getPixels(this.lastImage, (err, pixels)=> {
      if(err) {
        console.log("Bad image path");
      }
      // console.log("got pixels", pixels.data)
      // console.log("pixel size", pixels.size)
      // console.log("pixel shape", pixels.shape)
      var nx = pixels.shape[0], //width
      ny = pixels.shape[1] //height
  
      var meanHeight1 = 0;
      var widthSum1 = 0;
      for (var i = 0; i<nx; i++){
        var heightSum1= 0;
        for (var j = 0; j<ny; j++){
            var greyScaleEachPixel1 = ((pixels.get(i,j,0)+pixels.get(i,j,1)+pixels.get(i,j,2))/3);
            heightSum1 = heightSum1 + greyScaleEachPixel1
            // console.log("red ",pixels.get(i,j,0))
            // console.log("blue ",pixels.get(i,j,1))
            // console.log("green ",pixels.get(i,j,2))
        }
        meanHeight1 = heightSum1/ny;
        widthSum1 = widthSum1 +meanHeight1
      }
      var widthMean1 = widthSum1/nx;
      var ntu1 = 3.80*(widthMean1)+5.35;
      this.ntu = ntu1;
      this.uiProvider.showAlert('Result', this.ntu + ' NTU');
    })
  }
}
