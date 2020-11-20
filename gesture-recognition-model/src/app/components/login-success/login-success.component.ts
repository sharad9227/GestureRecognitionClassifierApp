import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, ViewChild ,Output, Input} from '@angular/core';
import * as fp from 'fingerpose';
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
        public interbval;
        public webcamFeed;
       public webcamConfig;
       public volControl:number;
       public action='';
       public vid='H9154xIoYTA';
      //output
      public result={'name':'','confidence':0.0 };
      public videoState="initial";
      public estimator;
      public loadLocalVideo=false;
      public loadIframe=false;
      public videoConfiguration = {  width: 640, height: 480, fps: 20 };
       xcor=[];
       ycor=[];
       xcor1=[];
       ycor1=[];
      //own
       actions = {
                  'no_gesture':'No hands',
                  'vol_up': '👆',
                  'peaceGesture': 'Play',
                  'vol_down' : '👇',
                  'stopGesture':'Pause',
                  'threeFingers':'three',
                  'fourFingers':'four',
                  'index_up':'choose'
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
 /* referenced below line  tensorflow preloaded model https://www.npmjs.com/package/@tensorflow-models/handpose*/
  const model = await handpose.load();

  // main estimation loop


   this.estimator = async () => {

       //Erasing the whole canvas
      ctx.clearRect(0, 0, this.videoConfiguration.width, this.videoConfiguration.height);
      // get hand landmarks from video
     /* referenced below line tensorflow preloaded model https://www.npmjs.com/package/@tensorflow-models/handpose  https://github.com/tensorflow/tfjs-models/blob/master/handpose/src/index.ts*/
      const predictions = await model.estimateHands(this.webcamConfig, false);



       //setting default no hand gesture
       this.result.name='no_gesture';
       this.action=this.actions[this.result.name];


      if(predictions.length>0 && predictions[0].handInViewConfidence>0.98)
      {
        //since handpose can detect only one hand at a time ,length is at max 1 denoted by predictions[0]
        const handPoints = predictions[0].annotations;
        const height=predictions[0].boundingBox.bottomRight[1]-predictions[0].boundingBox.topLeft[1];
        const width=predictions[0].boundingBox.bottomRight[0]-predictions[0].boundingBox.topLeft[0];
        ctx.strokeRect(predictions[0].boundingBox.topLeft[0],predictions[0].boundingBox.topLeft[1],width,height);
        ctx.strokeStyle = 'green';
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
              //  console.log(predictions[0].handInViewConfidence);

              //creating rectangle box around hand

             this.drawLines(ctx, jointPoints[0], jointPoints[1], 'blue', moveX, moveY, lineX, lineY);

            }
           });

          });






          // now estimate gestures based on landmarks
          // using a minimum confidence of 7.5 (out of 10)
          /* referenced fingerpose https://www.npmjs.com/package/fingerpose */
          const est = GE.estimate(predictions[0].landmarks, 7.5);

          if (est.gestures.length > 0) {

              // find gesture with highest confidence
              this.result = est.gestures.reduce((p, c) => {return (p.confidence > c.confidence) ? p : c;});
              this.action = this.actions[this.result.name];

            /* referenced fingerpose https://www.npmjs.com/package/fingerpose */

             }
              if(this.result && this.result.name!="no_gesture")
            {
                  this.actionMapper(this.result.name);
            }




                // if(this.xcor.length!=0 && this.ycor.length!=0)
                // {
                //     //values are not empty and have populated
                //     let xcortemp=this.xcor[0];
                //     let xcorlast=this.xcor[this.xcor.length-1];
                //     let ycortemp=this.ycor[0];
                //     let ycorlast=this.ycor[this.ycor.length-1];
                //     let descending=false;
                //     let ascending =false;
                //     let descCounter=0;
                //     let ascCounter=0;
                    // for(let i=0;i<this.xcor.length-1;i++)
                    // {

                    //   if(this.xcor.length>10)
                    //   {
                    //     const difference=this.xcor[i+1] - this.xcor[i];
                    //       console.log(difference);
                    //       if(difference>30 && xcortemp>0  )
                    //       {
                    //         descending=true;
                    //         descCounter++;

                    //         console.log(true);
                    //       }
                    //   else if(difference<-30){
                    //           console.log(false);
                    //           ascCounter++;
                    //           ascending=true;
                    //    }

                       //do not use
                //       else if(difference<20 && xcortemp>0)
                //       {
                //         descCounter--;
                //         descending=false;
                //       }
                //       else if(difference>-20 && difference<0){
                //         console.log(false);
                //         ascCounter--;
                //         ascending=false;
                //  }



                  //    }
                  // }


                      // if(ascCounter<descCounter)
                      // {
                      //  alert("Horizontal Swipe from right to left");
                      // }
                      // else{
                      //   if(descCounter<ascCounter)
                      //   {
                      //    alert("Horizontal Swipe from left to right");
                      //   }

                      // }

              //  }
  }

                //     if(xcortemp>0 && xcorlast<0)
                //     {
                //      // alert("Horizontal Swipe from left to right");
                //     }
                //     else if (xcortemp<0 && xcorlast>0)
                //     {
                //   //    alert("Horizontal Swipe from right to left");
                //     }
                //    else if(ycortemp>0 && ycorlast<0)
                //     {
                //   //    alert("Vertical Swipe from down to up");
                //     }
                //     else if (ycortemp<0 && ycorlast>0)
                //     {
                //       alert("Vertical Swipe from up to down");
                //     }
                //     // else if(ycortemp>0 && ycorlast<0 && xcortemp>0 && xcorlast<0 )
                //     // {
                //     //   alert("Horizontal Swipe from left to right");
                //     // }
                //     // else if (ycortemp<0 && ycorlast>0 && xcortemp<0 && xcorlast>0)
                //     // {
                //     //   alert("Horizontal Swipe from right to left");
                //     // }
                //   }
                //     else {
                //           console.log(this.xcor+"x");
                //           console.log(this.ycor+"Y");
                //           this.xcor=[];
                //           this.ycor=[];
                // }
                else {

                          //  this.xcor=[];
                          //  this.ycor=[];

                            if(this.result.name=='')
                            {
                              this.result.name='no_gesture';
                              this.result.confidence=0.0;
                              this.action=this.actions[this.result.name];
                            }
                  }





// calling async function after every 50 milliseconds
this.interbval=setInterval(() => { this.estimator(); }, 100);
};

this.estimator();
console.log('Starting predictions');
}



public actionMapper(res){

  switch(res) {
          case "peaceGesture": {
            if(this.loadLocalVideo)
            {
              this.targetMedia.nativeElement.play();
            }
           else if(this.loadIframe) {
             alert("play");
              this.videoState="onReady";
            }
            //  this.iframe.nativeElementcontentWindow.document.addEventListener()
            break;
          }
          case "stopGesture": {
            if(this.loadLocalVideo)
              {
               this.targetMedia.nativeElement.pause();
              }
             else if(this.loadIframe) {
               alert("pause");
            this.videoState="onPause";
            }
            break;
          }
          case "vol_down": {

            //implement slider
            if(this.loadLocalVideo)
            {
              this.targetMedia.nativeElement.volume = this.targetMedia.nativeElement.volume - 0.25;
              this.volControl=this.targetMedia.nativeElement.volume;
            }
            else if(this.loadIframe){
              this.videoState=this.result.name;
            }
            break;
          }
          case "vol_up": {

            //implement slider
            if(this.loadLocalVideo)
            {
            this.targetMedia.nativeElement.volume = this.targetMedia.nativeElement.volume + 0.25;
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
              break;
          }


          case "threeFingers" :{
            this.loadIframe = true;
            this.loadLocalVideo =false;
            break;
          }
          default: {

            break;
          }
}
}



//own
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
  const constraints = {
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
        frameRate: { max: 20 }
    }
};
//own
        this.webcamFeed = this.videoplayer.nativeElement;
        this.webcamFeed.width=640;
        this. webcamFeed.height=480;

// get video stream ::own
        navigator.mediaDevices.getUserMedia(constraints).then((feedData)=>
        {
          this.webcamFeed.srcObject = feedData;
          this.webcamFeed.play();
          this.GestureEstimationFunction();
        })
        .catch((error)=>{
          alert("Something went wrong."+error);
        });



 }



 ngOnDestroy() {
  clearInterval(this.interbval);
  if(this.webcamFeed.srcObject.active)
  {
    const videoTrack = this.webcamFeed.srcObject.getTracks();
    videoTrack[0].stop;
    this.webcamFeed.srcObject=null;

  }
 }



}

