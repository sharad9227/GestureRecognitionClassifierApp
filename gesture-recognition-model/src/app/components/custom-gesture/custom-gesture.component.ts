import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as p5 from "p5";
// import * as ml5 from "ml5";
import { User } from 'src/app/models/ValidUserComponent';
import { AjaxService } from 'src/app/services/ajaxService.service';
import { SharedService } from 'src/app/services/shared.service';
import {GestureActions} from '../../interface/customGestureInterface';
import {premiumGestureConfig} from '../../models/premiumGestureConfig';
import Swal from 'sweetalert2';
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
      public counter=0;
      public snaps=[];
      public canvasEnabled=false;
      public showUploadButton=false;
       //creating private model for data security
      private gestureConfig:premiumGestureConfig =new premiumGestureConfig();

      //assigning values

     gestureAction: GestureActions[] = [
        {label: 'localVideo', action: 'Select app videos'},
        {label: 'iFrame',     action: 'Select your own videos'},
        {label: 'vol_up',      action: 'Increase Volume'},
        {label: 'vol_down',    action: 'Decrease Volume'},
        {label: 'seekForward', action:'Seek Forward'},
        {label:'seekBackward', action:'Seek Backward'},
        {label:'play',        action:'Play Media'},
        {label:'pause',       action:'Pause Media'},
        {label:'noAction',     action:'No Action'}

      ];


      cofirmUpload =  Swal.mixin({
        icon:'info',
        text: "Your will not be able to reverse this action!",
        showCancelButton: true,
        confirmButtonText: "Yes, upload it!",
      });





      //after init variables (view init : Scope Access)
      @ViewChild('webcamFeed') videoplayer: ElementRef;
      @ViewChild('Canvas') canvasElement:ElementRef;

      constructor(public elementRef: ElementRef,private sharedService:SharedService,private ajaxService:AjaxService) {



      }
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

            this.elementRef.nativeElement.querySelector('#load').addEventListener('click', this.loadFile.bind(this));
          this.sharedService.openSideNavDrawer(true);


          //initialise knn classifier
          this.knnClassifier = ml5.KNNClassifier();
          this.mobileNetFeatureExtractor = ml5.featureExtractor('MobileNet', res => {
            console.log("feature extractor loaded");
           //   this.logits = this.mobileNetFeatureExtractor.infer(this.videoplayer.nativeElement);
           //  this.knnClassifier.addExample(this.logits, this.actionSelected.label);
          //  console.log(this.actionSelected.label+"added");

           });

          }


  ngAfterViewInit(): void {

      this.videoConstraints = {
        audio: false,
        video: {
         width:{
               min:120,
               max:400
            },

            height:{
               min:120,
               max:300,
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
        this.counter++;
      }

   }

    uploadFile()
    {
      let jsonContent,blob,fileReader;
      this.showUploadButton=true;

      const file = this.elementRef.nativeElement.querySelector('#fileUpload');
      file.addEventListener('change',()=>{
        this.cofirmUpload.fire({
          title: "Are you sure you want to upload this file?" + file.files[0].name,
        }).then((res)=>{
          if(res.isConfirmed && file.files[0].type=="application/json")
          {

            // check for already uploaded files
          fileReader = new FileReader();
          fileReader.readAsText(file.files[0]);
         fileReader.onload= ()=>{
          jsonContent=JSON.parse(fileReader.result);
          this.gestureConfig.configId = parseInt(localStorage.getItem('configId'));
          this.gestureConfig.configJsonData = fileReader.result;

          this.ajaxService.getGestureConfig(this.gestureConfig.configId).subscribe(data=>{
                 if(data!=null &&  data.responseObj.configData==null)
                 {
                    this.ajaxService.updateGestureConfig(this.gestureConfig).subscribe(data =>{
                       if(data!=null && data.message==="Training Model saved Succesfully")
                       {
                         Swal.fire("Uploaded!", "Your file has been uploaded.", "success");
                       }
                     },
                      error => {
                           Swal.fire("Failed!", "Your file could not be uploaded.", error);
                      })

                 }
                 else if(data!=null && data.responseObj.configData!=null)
                 {
                   if(data.responseObj.configData!='')
                   {
                    this.cofirmUpload.fire({
                      //Swal.fire("Warning!", "You already have uploaded data.", "success");
                      title:"Warning! You already have uploaded data. Do you want to replace it"
                      //update json config data
                    }).then((res1)=>{
                      if(res1.isConfirmed && file.files[0].type=="application/json")
                      {
                        this.ajaxService.updateGestureConfig(this.gestureConfig).subscribe(data =>{
                          if(data!=null && data.message==="Training Model saved Succesfully")
                          {
                            Swal.fire("Uploaded!", "Your file has been uploaded.", "success");
                            Swal.fire("File Replaced");
                          }
                        },
                         error => {
                              Swal.fire("Failed!", "Your file could not be uploaded.", error);
                         })
                      }
                      else if(res.dismiss==Swal.DismissReason.cancel)
                        {
                          Swal.fire("Upload Cancelled!", "Please upload the model file", "error");
                        }

                   })



                 }

             }
            },
          error => {
            Swal.fire("Error!", "Some problem in fetching", error);
          })



          // blob = new Blob([JSON.stringify(fileReader.result)], {type:"application/json"});

        }


      }
      //referred cancel swal usage
      else if(res.dismiss==Swal.DismissReason.cancel)
      {
        Swal.fire("Upload Cancelled!", "Please upload the model file", "error");
      }

        else{
          Swal.fire("Upload Cancelled!", "Please upload the downloaded file of json format", "error");
        }







        });





        console.log(jsonContent);
      });


    }

    saveFile(){
      let fileName = 'dataset.json';
       this.knnClassifier.save(fileName);
    }

loadFile(){
    this.knnClassifier.load('./../../../assets/model/model3.json',()=> {
      console.log("knn loaded");
      this.goClassify();
  });

}

 goClassify() {
let logitsInfer = this.mobileNetFeatureExtractor.infer(this.videoplayer.nativeElement);
 //const predictions =this.knnClassifier.predict();
  this.knnClassifier.classify(logitsInfer, 3, function(err, result) {
    let confidence,label;
      if (err) {
          console.log(err);
      } else if (result) {
          alert(result);
          confidence = result.confidencesByLabel;
          label = Object.keys(confidence).reduce(function(a, b) { return confidence[a] > confidence[b] ? a : b });
          console.log(confidence);
          console.log(label);
          console.log(confidence[label]);
        //  const res=this.mobileNetFeatureExtractor.predict(this.goClassify());
          //this.goClassify();
      }
      else{

      }
  });
}
getBadgeCount():number{
return this.counter;
}


}
