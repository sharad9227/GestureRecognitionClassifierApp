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
  public loadSuccess:string="Training Model loaded";
  public localAction='';
  public action='';
  actions = {
    'noAction':'No hands',
    'vol_up': 'vol up',
    'play': 'Play',
    'vol_down' : 'vol down',
    'pause':'Pause',
    'seekForward':'seekForward',
    'seekBackward':'seekBackward'
  };
  localVideoActions = {
    'play': '▶️',
    'pause':'⏸️',
    'vol_up': '',
    'vol_down' : '',
    'no_gesture':'',
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

  /* video constraints configuration */
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
                  if(this.interbval)
                  {
                  this.interbval.unsubscribe();
                  this.abortRequest.abort();
                  }
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
                  Swal.fire("Loaded!",this.loadSuccess,"success");
                  this.interbval = interval(1000).subscribe(() => { this.asyncFunction(this.abortSignal); });
                })

            }
            else if(data.responseObj.configData==null)
            {
              let message="No Training Set found";
              Swal.fire("Error!", message,"error");
            }

          },)
        }

        /* Starting predictions on successful load of model
        * @param abortSignal the abort request passed on stop webcam
        * maps the action to the media element
        */


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
                  if(maxScore>=0.7)
                  {
                   // this.testAlert.fire({text: "Predicted Gesture:- " + label});
                   this.action=this.actions[label];
                    this.actionMapper(label);
                  }
                  else{
                    label="noAction";
                    this.action=this.actions[label];
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
                       this.videoState="onReady";
                    break;
                  }
                  case "pause": {
                      this.videoState="onPause";
                      break;
                  }
                  case "vol_down": {
                      this.videoState=res;
                    break;
                  }
                  case "vol_up": {
                    this.videoState=res;
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
