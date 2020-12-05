import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as p5 from "p5";
import { User } from 'src/app/models/ValidUserComponent';
import { AjaxService } from 'src/app/services/ajaxService.service';
import { SharedService } from 'src/app/services/shared.service';
import {GestureActions} from '../../interface/customGestureInterface';
import {premiumGestureConfig} from '../../models/premiumGestureConfig'
declare let ml5: any;

  @Component({
    selector: 'app-custom-gesture',
    templateUrl: './custom-gesture.component.html',
    styleUrls: ['./custom-gesture.component.css']
  })
export class CustomGestureComponent implements OnInit,AfterViewInit {
  //member variables
      public mobileNetFeatureExtractor;
      public featureClassifier;
      public knnClassifier;
      public navigator;
      public videoConstraints;
      public webcamFeed;
      public actionSelected;
      public canvas;
      public logits;
      public snaps=[];
      public canvasEnabled=false;
      public showUploadButton=false;
       //creating private model for data security
      private gestureConfig:premiumGestureConfig =new premiumGestureConfig();

      //assigning values

     gestureAction: GestureActions[] = [
        {label: 'localVideo', action: 'Select app videos'},
        {label: 'iFrame',     action: 'Select your own videos'},
        {label: 'volUp',      action: 'Increase Volume'},
        {label: 'volDown',    action: 'Decrease Volume'},
        {label: 'fastForward',action:'Seek Forward'},
        {label:'goBack',      action:'Seek Backward'},
        {label:'play',        action:'Play Media'},
        {label:'pause',       action:'Pause Media'},
        {label:'default',     action:'No Action'}

      ];


      //after init variables (view init : Scope Access)
      @ViewChild('webcamFeed') videoplayer: ElementRef;
      @ViewChild('Canvas') canvasElement:ElementRef;

      constructor(public elementRef: ElementRef,private sharedService:SharedService,private ajaxService:AjaxService,private user:User) {}
        ngOnInit(): void {

          //let features = ml5.featureExtractor('MobileNet', model);

            /*  Section for click handling  */

             //start webcam
            this.elementRef.nativeElement.querySelector('#webcam').addEventListener('click', this.switchOnWebcam.bind(this));

            //stop webcam
            this.elementRef.nativeElement.querySelector('#stop').addEventListener('click', this.stopWebcam.bind(this));

            //click handling for dropdown select
            this.elementRef.nativeElement.querySelector('#sampleClick').addEventListener('click', this.addImages.bind(this));
            //export button
            this.elementRef.nativeElement.querySelector('#export').addEventListener('click', this.uploadFile.bind(this));
            //save button
            this.elementRef.nativeElement.querySelector('#download').addEventListener('click', this.saveFile.bind(this));


          this.sharedService.openSideNavDrawer(true);


          //initialise knn classifier
          this.knnClassifier = ml5.KNNClassifier();
          this.mobileNetFeatureExtractor = ml5.featureExtractor('MobileNet', res => {
            console.log("feature extractor loaded");
           //   this.logits = this.mobileNetFeatureExtractor.infer(this.videoplayer.nativeElement);
           //  this.knnClassifier.addExample(this.logits, this.actionSelected.label);
            console.log(this.actionSelected.label+"added");

           });
          }


  ngAfterViewInit(): void {

      this.videoConstraints = {
        audio: false,
        video: {
            facingMode: 'user',
             width:{
               min:120,
               max:480
            },

            height:{
               min:120,
               max:360,
            },
            frameRate: { max: 20 }
        }
    };
    //own
            this.webcamFeed = this.videoplayer.nativeElement;
            this.webcamFeed.width=this.videoConstraints.video.width.max;
            this.webcamFeed.height=this.videoConstraints.video.height.max;
            this.canvas = this.canvasElement.nativeElement;
    //button click logic

          //  let features,knn;

           //let sketch = (p5RefObject: p5) => {

          //    console.log(p5RefObject);


             //setup function
    //          p5RefObject.setup = () => {
    //          features = ml5.featureExtractor('MobileNet', modelReady);
    //          knn = ml5.KNNClassifier();
    // console.log(knn);
    //            // p.createCanvas(p.windowWidth, p.windowHeight);

    //          };




      }





      switchOnWebcam(event)
      {

        //navigator source object
        this.navigator = navigator.mediaDevices;
        if(this.navigator){
            this.navigator.getUserMedia(this.videoConstraints).then((feedData)=>
            {
              this.webcamFeed.srcObject = feedData;
              this.webcamFeed.play();
            })
            .catch((error)=>{
              alert("Something went wrong."+error);
            });


         }

      }
   //stopping webcam
    stopWebcam()
    {
      if(this.webcamFeed.srcObject.active)
    {
      const videoTrack = this.webcamFeed.srcObject.getTracks();

      videoTrack.forEach(function(tracks) {
        tracks.stop();
      });
      this.webcamFeed.srcObject=null;

    }
    }

    addImages(event){
      if(this.actionSelected!=undefined && this.actionSelected.action!="")
      {
        this.canvasEnabled=true;
        this.canvas.getContext('2d').drawImage(this.videoplayer.nativeElement, 0, 0, 200, 200);
        this.logits = this.mobileNetFeatureExtractor.infer(this.videoplayer.nativeElement);
        this.knnClassifier.addExample(this.logits, this.actionSelected.label);
      }

   }

    uploadFile()
    {
      let jsonContent,blob,fileReader;
      this.showUploadButton=true;

      const file = this.elementRef.nativeElement.querySelector('#fileUpload');
      file.addEventListener('change',()=>{
         fileReader = new FileReader();
         fileReader.readAsText(file.files[0]);




         fileReader.onload= ()=>{
          jsonContent=JSON.parse(fileReader.result);
          this.gestureConfig.configId = parseInt(localStorage.getItem('configId'));
          this.gestureConfig.configJsonData = jsonContent;
          this.ajaxService.updateGestureConfig(this.gestureConfig).subscribe(data =>{
             if(data!=null && data.message==="Training Model saved Succesfully")
             {
               alert("saved success");
             }
          }),

            error => {
               alert("error");
            }


          // blob = new Blob([JSON.stringify(fileReader.result)], {type:"application/json"});

        }
        console.log(jsonContent);
      });


    }

    saveFile(){
      let fileName = 'model.json';
       this.knnClassifier.save(fileName);
    }



}
