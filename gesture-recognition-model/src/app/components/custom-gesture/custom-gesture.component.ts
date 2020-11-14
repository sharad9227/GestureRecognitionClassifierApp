import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as p5 from "p5";
import {GestureActions} from '../../interface/customGestureInterface';

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
      public navigator;
      public videoConstraints;
      public webcamFeed;
      public actionSelected;
      public canvas;
      public snaps=[];
      public canvasEnabled=false;
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

      constructor(public elementRef: ElementRef) {}
        ngOnInit(): void {
          alert("in init");
          let features = ml5.featureExtractor('MobileNet', model);

            /*  Section for click handling  */

             //start webcam
            this.elementRef.nativeElement.querySelector('#webcam').addEventListener('click', this.switchOnWebcam.bind(this));

            //stop webcam
            this.elementRef.nativeElement.querySelector('#stop').addEventListener('click', this.stopWebcam.bind(this));

            //click handling for dropdown select
            this.elementRef.nativeElement.querySelector('#sampleClick').addEventListener('click', this.addImages.bind(this));


          function model(){
         //   let vd=this.videoplayer.nativeElement;
         //   console.log('model ready  in init'+vd);
          }
          //this.startWebcam();


          }


  ngAfterViewInit(): void {
    alert("in view");
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



    // function modelReady() {
    //   console.log('model ready!');
    //   const logits = features.infer(video1);
    //   console.log(logits);
    // }

            //draw function
          //   p5RefObject.draw = () => {

          //    };
          //  };

          //  new p5(sketch);

          //   });

          // })
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
      videoTrack[0].stop;
      this.webcamFeed.srcObject=null;

    }
    }

    addImages(event){
      if(this.actionSelected!=undefined && this.actionSelected.action!="")
      {
        this.canvasEnabled=true;
        this.canvas.getContext('2d').drawImage(this.videoplayer.nativeElement, 0, 0, 200, 200);

        let KNNClassifier = ml5.KNNClassifier();
        this.mobileNetFeatureExtractor = ml5.featureExtractor('MobileNet', res => {
         console.log("feature extractor loaded");
         const logits = this.mobileNetFeatureExtractor.infer(this.videoplayer.nativeElement);
         KNNClassifier.addExample(logits, this.actionSelected.label);
         console.log(this.actionSelected.label+"added");
         let fileName = 'model.json';
         KNNClassifier.save(fileName);
        });

       // KNNClassifier.addExample(logits, this.actionSelected.label);



        // let x=0;
        // let y=0;
        // let w=40;
        // let counter=1;

        // this.snaps.push(this.videoplayer.nativeElement);
        // console.log(this.snaps);
        // while(this.iteration<this.snaps.length)
        // {
        //   const context = this.canvas.getContext('2d').drawImage(this.snaps[this.iteration], x, y, 80, 60);
        //   x=x+80;
        //   this.iteration++;
        //   //counter++;
        //   console.log(context);
        }
      }

    //  let sketch = (p5RefObject: p5) => {
    //   p5RefObject.draw = () => {
    //     let i=0;
    //     let w=40;
    //     let h=40;
    //     let x=0;
    //     let y=0;
    //     while(i<this.snaps.length)
    //     {
    //       p5RefObject.image(this.snaps[i],x,y,w,h);
    //       p5RefObject.noCanvas();
    //       x=x+w;
    //       if(x>x+480)
    //       {
    //           x=0;
    //           y=y+h;
    //       }
    //     }
    //        };
    //        p5RefObject.setup = () => {

    //         this.snaps.push(this.videoplayer.nativeElement.get());
    //       }




    //      };

    //      new p5(sketch);

    // };







}
