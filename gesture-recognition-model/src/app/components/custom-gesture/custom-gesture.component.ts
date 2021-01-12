import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
      public successMessage:string="Training Model saved Successfully";
      public uploadFailure:string="Your file could not be uploaded.";
      public uploadRequest:string="Please upload the training dataset";
      public adviseMessage:string= "Please upload the downloaded file named dataset";
      public uploadMessage:string ="Your file has been uploaded";
       //creating private model for data security
      private gestureConfig:premiumGestureConfig =new premiumGestureConfig();

      //assigning values

     gestureAction: GestureActions[] = [
        {label: 'vol_up',      action: 'Increase Volume'},
        {label: 'vol_down',    action: 'Decrease Volume'},
        {label: 'seekForward', action:'Seek Forward'},
        {label:'seekBackward', action:'Seek Backward'},
        {label:'play',         action:'Play Media'},
        {label:'pause',        action:'Pause Media'},
        {label:'noAction',     action:'No Action'}

      ];


      cofirmUpload =  Swal.mixin({
        icon:'info',
        text: "You will not be able to reverse this action!",
        showCancelButton: true,
        confirmButtonText: "Yes, upload it!",
      });

      confirmDelete=  Swal.mixin({
          icon:'warning',
          text: "You will not be able to reverse this action!",
          showCancelButton: true,
          confirmButtonText: "Delete Samples",
      });


      //after init variables (view init : Scope Access)
      @ViewChild('webcamFeed') videoplayer: ElementRef;
      @ViewChild('Canvas') canvasElement:ElementRef;

      constructor(public elementRef: ElementRef,private sharedService:SharedService,private ajaxService:AjaxService) {



      }
        ngOnInit(): void {

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
            //clear labels button
            this.elementRef.nativeElement.querySelector('#sampleRemove').addEventListener('click', this.removeImages.bind(this));


           this.sharedService.openSideNavDrawer(true);


          //initialise knn classifier
          this.knnClassifier = ml5.KNNClassifier();
          this.mobileNetFeatureExtractor = ml5.featureExtractor('MobileNet', res => {
            console.log("feature extractor loaded");

           });

          }

/* video constraints configuration */
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

            this.webcamFeed = this.videoplayer.nativeElement;
            this.webcamFeed.width=this.videoConstraints.video.width.max;
            this.webcamFeed.height=this.videoConstraints.video.height.max;
            this.canvas = this.canvasElement.nativeElement;


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
   /*
   method to add images for a selected label
   adds image to knn classifier
   */
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
  /*
   method to remove images for a selected label
   removes image from knn classifier

  */

   removeImages(event)
   {
    this.confirmDelete.fire({
      title: "Are you sure you want to delete the samples for action : "+ this.actionSelected.action
    }).then((res)=>{
    if(this.actionSelected!=undefined && this.actionSelected.action!="" && res.isConfirmed)
    {
       let deletedLabel=this.knnClassifier.getCountByLabel();
       let label=this.actionSelected.label;
       console.log(deletedLabel);
       if(deletedLabel[label]>0)
       {
      this.knnClassifier.clearLabel(this.actionSelected.label);
      this.counter=this.counter-deletedLabel[label];
  }
   }
   else
   {
    Swal.fire("Delete Cancelled!");
   }
  })
  }

      /*
      Reads the fileContent on file change
      Checks for existing file in database
      sends config data to the database
      */
    uploadFile()
    {
      let jsonContent,fileReader;
      this.showUploadButton=true;

      let file = this.elementRef.nativeElement.querySelector('#fileUpload');
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
                       if(data!=null && data.message===this.successMessage)
                       {
                         Swal.fire("Uploaded!", this.uploadMessage, "success");
                       }
                     },
                      error => {
                           Swal.fire("Failed!", this.uploadFailure, error);
                      })

                 }
                 else if(data!=null && data.responseObj.configData!=null)
                 {
                   if(data.responseObj.configData!='')
                   {
                    this.cofirmUpload.fire({
                      title:"Warning! You already have uploaded data. Do you want to replace it"
                      //update json config data
                    }).then((res1)=>{
                      if(res1.isConfirmed && file.files[0].type=="application/json")
                      {
                        this.ajaxService.updateGestureConfig(this.gestureConfig).subscribe(data =>{
                          if(data!=null && data.message===this.successMessage)
                          {
                            Swal.fire("Uploaded!", this.uploadMessage, "success");

                          }
                        },
                         error => {
                              Swal.fire("Failed!", this.uploadFailure , error);
                         })
                      }
                      else if(res1.dismiss==Swal.DismissReason.cancel)
                        {
                          Swal.fire("Upload Cancelled!", this.uploadRequest, "error");
                        }

                   })



                 }

             }
            },
          error => {
            Swal.fire("Error!", "Some problem in retreiving", error);
          })
        }
      }
      //referred cancel swal usage
      else if(res.dismiss==Swal.DismissReason.cancel)
      {
        Swal.fire("Upload Cancelled!", this.uploadRequest, "error");

      }
        else{
          Swal.fire("Upload Cancelled!",this.adviseMessage, "error");
        }

        });

        console.log(jsonContent);
      });

      //clearing file value on cancel
      file.onclick = function () {
        this.value = null;
    };

    }

    saveFile(){
      let fileName = 'dataset.json';
       this.knnClassifier.save(fileName);
    }


getBadgeCount():number{
return this.counter;
}

ngOnDestroy() {
  if(this.webcamFeed.srcObject && this.webcamFeed.srcObject.active)
  this.stopWebcam();
}

}
