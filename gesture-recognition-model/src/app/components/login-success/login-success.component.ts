import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, ViewChild ,Output, Input} from '@angular/core';
 import {DynamicScriptLoaderService} from '../../services/dynamicScriptLoadService.service';
import * as fp from 'fingerpose';
//import {run} from './sketch';
import * as handpose from '@tensorflow-models/handpose';
import * as volDownGesture from '../../models/gestureSet/volDownGesture';
import * as volUpGesture from '../../models/gestureSet/volUpGesture';
import * as peaceGesture from './../../models/gestureSet/twoUpGesture';
import * as indexUpGesture from './../../models/gestureSet/indexUpGesture';
import * as threeFingersUpGesture from'./../../models/gestureSet/threeUpGesture';
import * as fourFingersUpGesture  from'./../../models/gestureSet/fourUpGesture';
import * as stopGesture  from'./../../models/gestureSet/stopGesture';
//import * as fp from 'fingerpose';

@Component({
  selector: 'app-login-success',
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.css']
})
export class LoginSuccessComponent implements OnInit,AfterViewInit {
  //own

    @ViewChild('webcamFeed') videoplayer: ElementRef;
    @ViewChild('iframe') iframe: ElementRef;
    @ViewChild('mediaTarget') targetMedia:ElementRef;
    @ViewChild('Canvas') canvasElement:ElementRef;
    @ViewChild('videoYouTube') mediaElement:any;


       public webcamConfig;
       public volControl:number;
       public action='';
       public vid='H9154xIoYTA';
      //output
      public result={'name':'','confidence':0.0 };
      public videoState="initial";
      public estimator;
      public videoConfiguration = {  width: 640, height: 480, fps: 20 };

      //own
       actions = {
                  'no_gesture':'No hands',
                  'vol_up': '👆',
                  'peaceGesture': 'Play',
                  'vol_down' : '👇',
                  'stopGesture':'Pause',
                  'threeFingers':'three',
                  'fourFingers':'four',
                  'index_up':'choose',
                  'no_recognition':'Not Gesture'
                };
        //own
       public  pointsMap = {
          palmBase :[0],
          thumb: [1, 2, 3, 4],
          indexFinger: [5, 6, 7, 8],
          middleFinger: [9, 10, 11, 12],
          ringFinger: [13, 14, 15, 16],
          pinky: [17, 18, 19, 20]
        }


        constructor(element:ElementRef){

        }
          ngOnInit(): void {
            console.log(this.targetMedia);

          }

async GestureEstimationFunction() {
  this.webcamConfig= this.videoplayer.nativeElement;
  const canvas: any = this.canvasElement.nativeElement;
  const ctx = canvas.getContext('2d');



  const gestures = [
      peaceGesture.default,
      fp.Gestures.ThumbsUpGesture,
      indexUpGesture.default,
      threeFingersUpGesture.default,
      fourFingersUpGesture.default,
      volUpGesture.default,
      volDownGesture.default,
      stopGesture.default
  ];
   //referenced fingerpose https://www.npmjs.com/package/fingerpose :Usage section
  const GE = new fp.GestureEstimator(gestures);
  // load handpose model
  const model = await handpose.load();
 //referenced fingerpose https://www.npmjs.com/package/fingerpose
  // main estimation loop


   this.estimator = async () => {

      // clear canvas overlay
      ctx.clearRect(0, 0, this.videoConfiguration.width, this.videoConfiguration.height);
      // get hand landmarks from video
      /* referenced fingerpose https://www.npmjs.com/package/fingerpose */
      const predictions = await model.estimateHands(this.webcamConfig, true);
       /* referenced fingerpose https://www.npmjs.com/package/fingerpose */


       //setting default no hand gesture
       this.result.name='no_gesture';
       this.action=this.actions[this.result.name];


      if(predictions.length>0 && predictions[0].handInViewConfidence>0.98)
      {
        //since handpose can detect only one hand at a time ,length is at max 1 denoted by predictions[0]
        const handPoints = predictions[0].annotations;

        Object.entries(handPoints).forEach(element => {
          let temp= element[0];
           let keys= this.pointsMap[temp];
           let landmarks:any=element[1];
           landmarks.forEach(jointPoints=>
             {
            for(let item=0;item<keys.length-1;item++)
              {
              const moveX=landmarks[item][0];
              const moveY=landmarks[item][1];
              const lineX =landmarks[item+1][0];
              const lineY=landmarks[item+1][1];
              console.log(predictions[0].handInViewConfidence);
             this.drawLines(ctx, jointPoints[0], jointPoints[1], 5, 'blue', moveX, moveY, lineX, lineY);

            }
           });

          });

          // now estimate gestures based on landmarks
          // using a minimum confidence of 7.5 (out of 10)
          /* referenced fingerpose https://www.npmjs.com/package/fingerpose */
          const est = GE.estimate(predictions[0].landmarks, 7.5);

          if (est.gestures.length > 0) {

              // find gesture with highest confidence
              this.result = est.gestures.reduce((p, c) => {
                  return (p.confidence > c.confidence) ? p : c;
              });
              this.action = this.actions[this.result.name];

            /* referenced fingerpose https://www.npmjs.com/package/fingerpose */

             }

                  this.actionMapper(this.result.name);

     }
              else
              {
                if(this.result.name=='')
                {
                  this.result.name='no_gesture';
                  this.result.confidence=0.0;
                  this.action=this.actions[this.result.name];
                }
              }


// calling async function after every 50 seconds
setInterval(() => { this.estimator(); }, 50);
};

this.estimator();
console.log('Starting predictions');
}



public actionMapper(res){

  switch(res) {
          case "peaceGesture": {
            this.videoState="onReady";
            //  this.iframe.nativeElementcontentWindow.document.addEventListener()
            this.targetMedia.nativeElement.play();
            break;
          }
          case "stopGesture": {
            this.videoState="onPause";
            this.targetMedia.nativeElement.pause();
            break;
          }
          case "vol_down": {

            //implement slider
            this.targetMedia.nativeElement.volume = 0.25;
            this.volControl=this.targetMedia.nativeElement.volume;
            alert("vol low"+this.volControl);
            this.videoState=this.result.name;
            break;
          }
          case "vol_up": {

            //implement slider
            this.targetMedia.nativeElement.volume = 1;
            this.volControl=this.targetMedia.nativeElement.volume;

            this.videoState=this.result.name;
            break;
          }
          default: {
            this.result.name='no_recognition';
            this.result.confidence=0.0;
            this.action=this.actions[this.result.name];
            break;
          }
}
}














//own
    public drawLines(ctx, x, y, r, color,mx1,my1,l1,l2) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(mx1,my1);
    ctx.lineTo(l1, l2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 3 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }


 ngAfterViewInit(){
  const constraints = {
    audio: false,
    video: {
        facingMode: 'user',
        width:{
          min:480,
          max:640
        },

        height:{
          min:240,
          max:480,
        },
        frameRate: { max: 20 }
    }
};
//own
        const webcamFeed: any = this.videoplayer.nativeElement;
        webcamFeed.width=640;
        webcamFeed.height=480;

// get video stream ::own
        const feedData =  navigator.mediaDevices.getUserMedia(constraints).then((feedData)=>
        {
          webcamFeed.srcObject = feedData;
         // webcamFeed.play();
         // this.GestureEstimationFunction();
        })
        .catch((error)=>{
          alert("Something went wrong."+error);
        });


      const promise= new  Promise<any>((resolve) =>{
        setTimeout(()=>{resolve(webcamFeed)},50);
      });

        promise.then((streamData)=> {
          webcamFeed.onloadedmetadata=streamData;
        })
        .catch((error)=>{
          alert("Something went wrong."+error);
        });

      promise.then((v)=> {

        v.play();
        v.addEventListener("loadeddata", ()=> {
        this.GestureEstimationFunction();
        });

      })



 }






}

