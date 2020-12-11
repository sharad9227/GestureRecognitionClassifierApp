import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AjaxService } from 'src/app/services/ajaxService.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-custom-gesture-testing',
  templateUrl: './custom-gesture-testing.component.html',
  styleUrls: ['./custom-gesture-testing.component.css']
})
export class CustomGestureTestingComponent implements OnInit,AfterViewInit {
  public webcamFeed;
  public videoConstraints;
  public navigator;
  public localAction='';
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
  @ViewChild('webcamFeed') videoplayer: ElementRef;
  @ViewChild('mediaTarget') targetMedia:ElementRef;
  constructor(public elementRef: ElementRef,private sharedService:SharedService,private ajaxService:AjaxService) { }

  ngOnInit(): void {
      //start webcam
      this.elementRef.nativeElement.querySelector('#webcam').addEventListener('click', this.switchOnWebcam.bind(this));

      //stop webcam
      this.elementRef.nativeElement.querySelector('#stop').addEventListener('click', this.stopWebcam.bind(this));
  }


  ngAfterViewInit() :void{
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

          //stopping webcam feed
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









}
