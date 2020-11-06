import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, ViewChild ,Output, Input} from '@angular/core';
 import {DynamicScriptLoaderService} from '../../services/dynamicScriptLoadService.service';
import * as fp from 'fingerpose';
//import {run} from './sketch';
import * as handpose from '@tensorflow-models/handpose';
import * as thumbsDownGesture from './../../models/gestureSet/thumbsDownGesture';
import * as peaceGesture from './../../models/gestureSet/twoUpGesture';
import * as indexUpGesture from './../../models/gestureSet/indexUpGesture';
import * as threeFingersUpGesture from'./../../models/gestureSet/threeUpGesture';
import * as fourFingersUpGesture  from'./../../models/gestureSet/fourUpGesture';
//import * as fp from 'fingerpose';

@Component({
  selector: 'app-login-success',
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.css']
})
export class LoginSuccessComponent implements OnInit,AfterViewInit {
  //own

    @ViewChild('poseVideo') videoplayer: ElementRef;
    @ViewChild('iframe') iframe: ElementRef;
    @ViewChild('mediaTarget') targetMedia:ElementRef;
    @ViewChild('Canvas') canvasElement:ElementRef;
    @ViewChild('videoYouTube') mediaElement:any;

  videoConfiguration = {  width: 640, height: 480, fps: 20 };
 action='';
 vid='H9154xIoYTA';

//output
 result={'name':'','confidence':0.0};
 videoState="initial";
//own
     actions = {
       'no_gesture':'No hands',
      'thumbs_up': '👍',
      'peaceGesture': 'Play',
      'thumbs_down' : '👎︎',
      'index_up':'Pause',
      'threeFingers':'three',
      'fourFingers':'four'
          };
//own
 pointsMap = {
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

  async initWebCam(frameWidth, frameheight, fps) {
  const constraints = {
      audio: false,
      video: {
          facingMode: 'user',
          width:{
            min:640,
            max:frameWidth
          },

          height:{
            min:240,
            max:frameheight,
          },
          frameRate: { max: fps }
      }
  };
//own
  const webcamFeed: any = this.videoplayer.nativeElement;
  webcamFeed.width = frameWidth;
  webcamFeed.height = frameheight;

  // get video stream ::own
  const feedData = await navigator.mediaDevices.getUserMedia(constraints).then((feedData)=>
  {
    webcamFeed.srcObject = feedData;
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

  return promise;


}

async GestureEstimationFunction() {

  const video: any = this.videoplayer.nativeElement;
  const canvas: any = this.canvasElement.nativeElement;
  const ctx = canvas.getContext('2d');

  const resultLayer: any = document.querySelector('#pose-result');


  const gestures = [
      peaceGesture.default,
      fp.Gestures.ThumbsUpGesture,
      indexUpGesture.default,
      threeFingersUpGesture.default,
      fourFingersUpGesture.default
  ];
   //referenced fingerpose https://www.npmjs.com/package/fingerpose :Usage section
  const GE = new fp.GestureEstimator(gestures);
  // load handpose model
  const model = await handpose.load();
 //referenced fingerpose https://www.npmjs.com/package/fingerpose
  // main estimation loop


  const est = async () => {

      // clear canvas overlay
      ctx.clearRect(0, 0, this.videoConfiguration.width, this.videoConfiguration.height);
      // get hand landmarks from video
      /* referenced fingerpose https://www.npmjs.com/package/fingerpose */
      const predictions = await model.estimateHands(video, true);
       /* referenced fingerpose https://www.npmjs.com/package/fingerpose */

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
             this.drawLines(ctx, jointPoints[0], jointPoints[1], 5, 'blue',moveX,moveY,lineX,lineY);

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


              if(this.result.name=="peaceGesture")
              {
                console.log(this.targetMedia);
                    this.videoState="onReady";
                    this.iframe.nativeElement.contentWindow.document.addEventListener()
                    this.targetMedia.nativeElement.play();
              }
              else if(this.result.name=="index_up")
              {
              this.videoState="onPause";
              this.targetMedia.nativeElement.pause();
              }
              else if(this.result.name=="threeFingers" || this.result.name=="fourFingers")
              {
                this.videoState=this.result.name;
              }
              else{

              }
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
setInterval(() => { est(); }, 50);
};

est();
console.log('Starting predictions');
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
 this.initWebCam(this.videoConfiguration.width,this.videoConfiguration.height,this.videoConfiguration.fps).then(video => {
    video.play();
    video.addEventListener("loadeddata", ()=> {
     this.GestureEstimationFunction();
    });
  })
  .catch((error)=>{
    alert("Some problem occurred with webcam.Please  try again.")
  })


}


}

