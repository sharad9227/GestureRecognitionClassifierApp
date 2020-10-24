import { Component, OnInit } from '@angular/core';
 import {DynamicScriptLoaderService} from '../../services/dynamicScriptLoadService.service';
import * as fp from 'fingerpose';
//import {run} from './sketch';
import * as handpose from '@tensorflow-models/handpose';
//import * as fp from 'fingerpose';

@Component({
  selector: 'app-login-success',
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.css']
})
export class LoginSuccessComponent implements OnInit {

  //constructor() { }
  //@ViewChild('poseVideo') videoplayer: ElementRef;
  constructor(){

  }
  ngOnInit(): void {

    console.log(fp);
    this.run();
  }

//add code after understanding angular lifecycle
  ngAfterViewInit(){

  }



  run():void{

    const config1 = {
    video: { width: 640, height: 480, fps: 30 }
    };



      const landmarkColors1 = {
        thumb: 'red',
        indexFinger: 'blue',
        middleFinger: 'yellow',
        ringFinger: 'green',
        pinky: 'pink',
        palmBase: 'white'
      };

      const gestureStrings1 = {
        'thumbs_up': '👍',
        'victory': '✌🏻'
      };

          async function main1() {

            const video: any = document.querySelector("#pose-video");
            const canvas: any = document.querySelector('#pose-canvas');
            const ctx = canvas.getContext('2d');

            const resultLayer: any = document.querySelector('#pose-result');

            // configure gesture estimator
            // add "✌🏻" and "👍" as sample gestures
            const knownGestures = [
                fp.Gestures.VictoryGesture,
                fp.Gestures.ThumbsUpGesture
            ];
            const GE = new fp.GestureEstimator(knownGestures);

            // load handpose model
            const model = await handpose.load();
            console.log('Handpose model loaded');

            // main estimation loop
            const estimateHands = async () => {

                // clear canvas overlay
                ctx.clearRect(0, 0, config1.video.width, config1.video.height);
                resultLayer.innerText = '';

                // get hand landmarks from video
                // Note: Handpose currently only detects one hand at a time
                // Therefore the maximum number of predictions is 1
                const predictions = await model.estimateHands(video, true);

                for (let i = 0; i < predictions.length; i++) {

                    // draw colored dots at each predicted joint position
                    // tslint:disable-next-line:forin
                    for (const part in predictions[i].annotations) {
                        for (const point of predictions[i].annotations[part]) {
                            drawPoint(ctx, point[0], point[1], 3, landmarkColors1[part]);
                        }
                    }

                    // now estimate gestures based on landmarks
                    // using a minimum confidence of 7.5 (out of 10)
                    const est = GE.estimate(predictions[i].landmarks, 7.5);

                    if (est.gestures.length > 0) {

                        // find gesture with highest confidence
                        let result = est.gestures.reduce((p, c) => {
                            return (p.confidence > c.confidence) ? p : c;
                        });

                        resultLayer.innerText = gestureStrings1[result.name];
                    }
                }

        // ...and so on
        setTimeout(() => { estimateHands(); }, 1000 / config1.video.fps);
      };

        estimateHands();
        console.log('Starting predictions');
  }

  async function initCamera(width, height, fps) {

    const constraints = {
        audio: false,
        video: {
            facingMode: 'user',
            width,
            height,
            frameRate: { max: fps }
        }
    };

    const video: any = document.querySelector('#pose-video');
    video.width = width;
    video.height = height;

    // get video stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;

    return new Promise<any>(resolve => {
        video.onloadedmetadata = () => { resolve(video);};
    });
  }

  function drawPoint(ctx, x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  window.addEventListener('DOMContentLoaded', () => {
   initCamera(
        config1.video.width, config1.video.height, config1.video.fps
    ).then(video => {
       video.play();
       video.addEventListener("loadeddata", event => {
          console.log("Camera is ready");
          main1();
      });
    });

    const canvas : any = document.querySelector("#pose-canvas");
    canvas.width = config1.video.width;
    canvas.height = config1.video.height;
    console.log("Canvas initialized");
  });
  }











}
