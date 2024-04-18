import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, ViewChild ,Output, Input, NgZone} from '@angular/core';
import * as fp from 'fingerpose';
import * as handpose from '@tensorflow-models/handpose';
import * as volDownGesture from '../../models/gestureSet/volDownGesture';
import * as volUpGesture from '../../models/gestureSet/volUpGesture';
import * as peaceGesture from '../../models/gestureSet/twoUpGesture';
import * as indexUpGesture from '../../models/gestureSet/indexUpGesture';
import * as threeFingersUpGesture from'../../models/gestureSet/threeUpGesture';
import * as stopGesture  from'../../models/gestureSet/stopGesture';
import * as fistGesture  from'../../models/gestureSet/fistGesture';
import { interval } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-universal-gesture',
  templateUrl: './univeral-gesture.component.html',
  styleUrls: ['./universal-gesture.component.css']
})
export class UniversalGestureComponent implements OnInit,AfterViewInit {


    @ViewChild('webcamFeed') videoplayer: ElementRef;
    @ViewChild('iframe') iframe: ElementRef;
    @ViewChild('mediaTarget') targetMedia:ElementRef;
    @ViewChild('Canvas') canvasElement:ElementRef;
    @ViewChild('videoYouTube') mediaElement:any;
    public model;
    public constraints;
    public interbval;
    public webcamFeed;
    public webcamConfig;
    public volControl:number;
    public action='';
    public localAction='';
      //output
    public result={'name':'','confidence':0.0 };
    public videoState="initial";
    public estimator;
    public loadLocalVideo=false;
    public loadIframe=false;
    public videoConfiguration = {  width: 640, height: 480};
    public  abortRequest = new AbortController();
    public abortSignal=this.abortRequest.signal;
    public localMediaElement;
    seekAlert =  Swal.mixin({
      icon:'info',
      showConfirmButton:false,
      timer:1000
    });
    //co-ordinates for dynamic co-ordinate tracking
       xcor=[];
       ycor=[];

       actions = {
                  'no_gesture':'No hands',
                  'vol_up': '👆',
                  'peaceGesture': 'Play',
                  'vol_down' : '👇',
                  'stopGesture':'Pause',
                  'threeFingers':'YoutubeVdo',
                  'fourFingers':'four',
                  'index_up':'appVideo',
                  'fist':'fist'
                };

       localVideoActions = {
                  'peaceGesture': '▶️',
                  'stopGesture':'⏸️',
                  'vol_up': '🔊',
                  'vol_down' : '🔉',
                  'no_gesture':'',
                  'threeFingers':'',
                  'fourFingers':'',
                  'index_up':''
        }


        //landmarks array for creative canvas landmark visualization
       public  pointsMap = {
          palmBase :[0],
          thumb: [1, 2, 3, 4],
          indexFinger: [5, 6, 7, 8],
          middleFinger: [9, 10, 11, 12],
          ringFinger: [13, 14, 15, 16],
          pinky: [17, 18, 19, 20]
        }


        constructor(private elementRef:ElementRef,private sharedService:SharedService){
        }
          ngOnInit(): void {}

/*
async function for estimating hand gestures
contains nested function that is subscribed after 100 ms for continuos video evaluation
dynamic gestures implemented with bounding box co-ordinates
*/



async GestureEstimationFunction() {
  this.webcamConfig= this.videoplayer.nativeElement;
  const canvas: any = this.canvasElement.nativeElement;
  const canvasContext = canvas.getContext('2d');
  const gestures = [
      peaceGesture.default,
      indexUpGesture.default,
      threeFingersUpGesture.default,
      volUpGesture.default,
      volDownGesture.default,
      stopGesture.default,
      fistGesture.default
  ];
   /*referenced fingerpose https://www.npmjs.com/package/fingerpose :Usage section */
  const GE = new fp.GestureEstimator(gestures);
  this.model = await handpose.load();
  /*reference end*/

  const asyncFunction = async (abortSignal)=>  {

       //Erasing the whole canvas
      canvasContext.clearRect(0, 0, this.videoConfiguration.width, this.videoConfiguration.height);
      //hand landmarks obtained from video
      const predictions = await this.model.estimateHands(this.webcamConfig, false);
      //setting default no hand gesture
       this.result.name='no_gesture';
       this.action=this.actions[this.result.name];
       this.localAction=this.localVideoActions[this.result.name];

      if(predictions.length>0 && predictions[0].handInViewConfidence>0.98)
      {
        //since handpose can detect only one hand at a time ,length is at max 1 denoted by predictions[0]
        const handPoints = predictions[0].annotations;
        const height=predictions[0].boundingBox.bottomRight[1]-predictions[0].boundingBox.topLeft[1];
        const width=predictions[0].boundingBox.bottomRight[0]-predictions[0].boundingBox.topLeft[0];
        canvasContext.strokeRect(predictions[0].boundingBox.topLeft[0],predictions[0].boundingBox.topLeft[1],width,height);
        canvasContext.strokeStyle = 'green';
        this.xcor.push(predictions[0].boundingBox.topLeft[0]);
        this.ycor.push(predictions[0].boundingBox.topLeft[1]);



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
              //creating rectangle box around hand
             this.drawLines(canvasContext, jointPoints[0], jointPoints[1], 'blue', moveX, moveY, lineX, lineY);

            }
           });

          });


          //  estimating gestures upon landmarks
          /* referenced fingerpose https://www.npmjs.com/package/fingerpose */
          const est = GE.estimate(predictions[0].landmarks, 7.5);
          if (est.gestures.length > 0) {
              // result gesture that has max confidence
              this.result = est.gestures.reduce((p, c) => {return (p.confidence > c.confidence) ? p : c;});
              /*reference end*/
              this.action = this.actions[this.result.name];
              this.localAction=this.localVideoActions[this.result.name];
             }
              if(this.result)
            {
                  this.actionMapper(this.result.name);
            }




                 if(this.result.name =='fist' && this.xcor.length!=0 && this.ycor.length!=0)
                  {
                 //values are not empty and have populated
                    let xcortemp=this.xcor[0];
                    let xcorlast=this.xcor[this.xcor.length-1];
                    let descending=false;
                    let ascending =false;
                    let descCounter=0;
                    let ascCounter=0;
                    for(let i=0;i<this.xcor.length-1;i++)
                    {

                      if(this.xcor.length>10)
                      {
                        const difference=this.xcor[i+1] - this.xcor[i];
                          if(difference>30 ||(xcortemp<0 && xcorlast>0))
                          {
                            descending=true;
                            descCounter++;
                          }
                      else if(difference<-30 || (xcortemp>0 && xcorlast<0)){
                              ascCounter++;
                              ascending=true;

                       }
                     }
                  }


                      if(ascCounter<descCounter)
                      {
                        //seek backward
                        this.seekAlert.fire({text: "Seeked Backwards by 5 seconds!"});
                        this.actionMapper('seekBackward');
                      }
                      else{
                        if(descCounter<ascCounter)
                        {
                          //seek forward
                          this.seekAlert.fire({text: "Fast Forwarded by 5 seconds!"});
                          this.actionMapper('seekForward');
                        }

                      }

               }
  }


                else {

                            this.xcor=[];
                            this.ycor=[];

                            if(this.result.name=='')
                            {
                              this.result.name='no_gesture';
                              this.result.confidence=0.0;
                              this.action=this.actions[this.result.name];
                              this.localAction=this.localVideoActions[this.result.name];
                            }
                  }
                        abortSignal.addEventListener('abort',() => {
                                 this.interbval.unsubscribe();
                          });

};
// calling async function after every 100 milliseconds
this.interbval = interval(100).subscribe(() => { asyncFunction(this.abortSignal); });
}


/*
Takes evaluated gesture result as input
contains Switch case for mapping results with media actions
action passed to youtube module whenever associated gesture received
*/


public actionMapper(res){
  this.localMediaElement=this.targetMedia.nativeElement;
  switch(res) {
          case "peaceGesture": {
            if(this.loadLocalVideo)
            {
              this.localMediaElement.play();
            }
           else if(this.loadIframe) {

              this.videoState="onReady";
            }

            break;
          }
          case "stopGesture": {
            if(this.loadLocalVideo)
              {
               this.localMediaElement.pause();
              }
             else if(this.loadIframe) {

            this.videoState="onPause";
            }
            break;
          }
          case "vol_down": {

            //implement slider
            if(this.loadLocalVideo && (this.localMediaElement.volume-0.1)>0)
            {

              this.localMediaElement.volume = this.localMediaElement.volume - 0.1;
              this.volControl=this.targetMedia.nativeElement.volume;
            }
            else if(this.loadIframe){
              this.videoState=this.result.name;
            }
            break;
          }
          case "vol_up": {

            //implement slider
            if(this.loadLocalVideo && (this.localMediaElement.volume+0.1)<1)
            {
            this.localMediaElement.volume = this.localMediaElement.volume + 0.1;
            this.volControl=this.targetMedia.nativeElement.volume;
            }
            else if(this.loadIframe){
            this.videoState=this.result.name;
            }
            break;
          }
          case "index_up"  :{
              this.loadLocalVideo =true;
              this.loadIframe=false;
              if(this.videoState=="onReady") this.videoState="onPause";
              break;
          }


          case "threeFingers" :{
            this.loadIframe = true;
            this.loadLocalVideo =false;
            if(!this.targetMedia.nativeElement.paused) this.targetMedia.nativeElement.pause();
            break;
          }
          case "seekForward":{
            if(this.loadLocalVideo)
            {
            if(this.targetMedia.nativeElement.seekable.length>0){
              this.targetMedia.nativeElement.currentTime =this.targetMedia.nativeElement.currentTime+ 5;
            };
          }
          else{
            this.videoState = res;
          }
            break;
          }
          case "seekBackward":{
            if(this.loadLocalVideo)
            {
             if( this.targetMedia.nativeElement.currentTime>5)
              this.targetMedia.nativeElement.currentTime =this.targetMedia.nativeElement.currentTime- 5;
             }
             else{
               this.videoState = res;
            }
            break;
        }

          default: {
            this.videoState='';
            break;
          }
}
}

    public drawLines(ctx, x, y, color,mx1,my1,l1,l2) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(mx1,my1);
    ctx.lineTo(l1, l2);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillRect(x-4, y-4, 6,6);
    ctx.fillStyle = color;
    ctx.fill();
  }


 ngAfterViewInit(){
  this.sharedService.openSideNavDrawer(true);
  this.constraints = {
    audio: false,
    video: {
        width:{
          min:320,
          max:640
        },

        height:{
          min:240,
          max:480,
        },
        frameRate: { max: 10 }
    }
};

        this.webcamFeed = this.videoplayer.nativeElement;
        this.webcamFeed.width=this.constraints.video.width.max;
        this. webcamFeed.height=this.constraints.video.height.max;

// get video stream
    if(navigator.mediaDevices)
    {
         navigator.mediaDevices.getUserMedia(this.constraints).then((feedData)=>
        {
          this.webcamFeed.srcObject = feedData;
         this.webcamFeed.play();
         this.GestureEstimationFunction();
        })
        .catch((error)=>{
          if(error.name ==='NotAllowedError')
          alert("Please allow access to your webcam in order to experience gesture control");

        else
          alert("Something went wrong" +error.name);
        });
      }
      else
      {
        alert("camera not switched on");
      }


 }

                /* Method to stop webcam and exit endless async loop */
                 stopWebcam()
                {
                this.interbval.unsubscribe();
                this.abortRequest.abort();
                this.webcamFeed.pause();
                if(this.webcamFeed.srcObject.active)
                  {
                    const stream = this.webcamFeed.srcObject;
                    const videoTracks = stream.getTracks();
                    videoTracks.forEach(function(track) {
                      track.stop();
                    });
                    this.webcamFeed.srcObject = null;
                  }
                this.interbval.unsubscribe();
               }


                 ngOnDestroy() {
                  this.stopWebcam();
                }



}

