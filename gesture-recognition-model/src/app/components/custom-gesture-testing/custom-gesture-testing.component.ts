import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { interval } from 'rxjs';
import { AjaxService } from 'src/app/services/ajaxService.service';
import { SharedService } from 'src/app/services/shared.service';
import Swal from 'sweetalert2';
declare let ml5: any;
@Component({
  selector: 'app-custom-gesture-testing',
  templateUrl: './custom-gesture-testing.component.html',
  styleUrls: ['./custom-gesture-testing.component.css']
})
export class CustomGestureTestingComponent implements OnInit,AfterViewInit {
 //member variables
  public webcamFeed;
  public videoConstraints;
  public navigator;
  public knnClassifier;
  public mobileNetFeatureExtractor;
  public interbval;
  //default initialization
  public videoState="";
  public volControl:number;

    public loadIframe=false;
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
testAlert =  Swal.mixin({
  icon:'info',
  showConfirmButton:false,
  timer:1000
});
public  abortRequest = new AbortController();
public abortSignal=this.abortRequest.signal;
  @ViewChild('webcamFeed') videoplayer: ElementRef;
  @ViewChild('mediaTarget') targetMedia:ElementRef;
  @ViewChild('videoYouTube') mediaElement:any;
  constructor(public elementRef: ElementRef,private sharedService:SharedService,private ajaxService:AjaxService) { }

  ngOnInit(): void {
      //start webcam
      this.elementRef.nativeElement.querySelector('#webcam').addEventListener('click', this.switchOnWebcam.bind(this));

      //stop webcam
      this.elementRef.nativeElement.querySelector('#stop').addEventListener('click', this.stopWebcam.bind(this));

     //load media
     this.elementRef.nativeElement.querySelector('#load').addEventListener('click', this.loadModel.bind(this));

          //initialise knn classifier
          this.knnClassifier = ml5.KNNClassifier();
          this.mobileNetFeatureExtractor = ml5.featureExtractor('MobileNet', res => {
            console.log("feature extractor loaded");

           });


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
                  this.interbval.unsubscribe();
                  this.abortRequest.abort();
                  this.webcamFeed.pause();
                }
              }


        loadModel()
        {
          let configId,jsonContent;
          configId = parseInt(localStorage.getItem('configId'));
          this.ajaxService.getGestureConfig(configId).subscribe(data=>{
            if(data!=null &&  data.responseObj.configData!=null)
            {
              jsonContent=JSON.parse(data.responseObj.configData);
                this.knnClassifier.load(jsonContent,()=> {
                  console.log("loaded");
                })
                this.interbval = interval(5000).subscribe(() => { this.asyncFunction(this.abortSignal); });
            }
            else if(data.responseObj.configData==null)
            {
              alert("No training set available");
            }

          },)
        }




        asyncFunction = async (abortSignal)=>  {
          if(this.webcamFeed.srcObject.active){
          let logitsInfer = this.mobileNetFeatureExtractor.infer(this.videoplayer.nativeElement);

          this.knnClassifier.classify(logitsInfer, 10 , (err, response)=> {

            let accuracyScore,label;
              if (err) {
                  console.log(err);
              } else if (response) {

                  accuracyScore =response.confidencesByLabel;
                  label = Object.keys(accuracyScore).reduce(function(a, b) { return accuracyScore[a] > accuracyScore[b] ? a : b });
                  let maxScore= accuracyScore[label];
                  console.log(label);
                  console.log(accuracyScore[label]);
                  if(maxScore>=0.6)
                  {
                   // this.testAlert.fire({text: "Predicted Gesture:- " + label});

                    this.actionMapper(label);
                  }
                  else{
                    label="noAction"
                  }
                  this.localAction=this.localVideoActions[label];
              }
              else{

              }
          });
        }
        else{
          alert("please switch on your webcam");
        }

        abortSignal.addEventListener('abort',() => {
          this.interbval.unsubscribe();
      });
        }

        public actionMapper(res){

          switch(res) {
                  case "play": {

                      if(this.loadIframe) {
                       this.videoState="onReady";
                      }
                    break;
                  }
                  case "pause": {

                      if(this.loadIframe) {
                             this.videoState="onPause";
                       }
                      break;
                  }
                  case "vol_down": {

                   if(this.loadIframe){
                      this.videoState="res";
                    }
                    break;
                  }
                  case "vol_up": {
                    //implement slider
                   if(this.loadIframe){
                    this.videoState=res;
                    }
                    break;
                  }
                  case "localVideo"  :{

                      this.loadIframe=false;
                      if(this.videoState=="onReady") this.videoState="onPause";
                      break;
                  }
                  case "iFrame" :{
                    this.loadIframe = true;

                    if(!this.targetMedia.nativeElement.paused) this.targetMedia.nativeElement.pause();
                    break;
                  }
                  case "seekForward":{

                    this.videoState = res;

                    break;
                  }
                  case "seekBackward":{

                       this.videoState = res;

                    break;
                }

                  default: {
                    this.videoState="";
                    break;
                  }
        }
        }



        ngOnDestroy() {
          if(this.webcamFeed.srcObject && this.webcamFeed.srcObject.active)

          this.stopWebcam();
       }

}
