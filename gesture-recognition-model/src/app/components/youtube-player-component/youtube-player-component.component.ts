import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-youtube-player-component',
  templateUrl: './youtube-player-component.component.html',
  styleUrls: ['./youtube-player-component.component.css']
})
export class YoutubePlayerComponent implements OnInit,OnChanges {
  videoId: string;
  textId:string;
  @ViewChild('youtubeplayer') youtubeplayer: any;
  @Input() videoState:string;


  popUpModalInfo = Swal.mixin({
    toast:true,
    position:'center',
    timer: 1000,
    showCloseButton:false
  });

  constructor() { }


  ngOnChanges():void{

 this.selectState(this.videoState);


}
ngOnInit(): void {
  //referred code https://github.com/angular/components/tree/master/src/youtube-player
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.body.appendChild(tag);
 //reffered code
}

public bind()
{
  this.videoId=this.textId;
}


  selectState(vd:string){
    //switch case implementation

    switch(vd) {
      case "onReady": {
        this.onReady();
        break;
      }
      case "onPause": {
        this.onPause();
        break;
      }
      case "vol_down":
      case "vol_up" :{
        this.volumeControl(vd);
        break;
      }
      case "seekForward" :
        this.seekForward();
        break;
      case "seekBackward":
        this.seekBackward();

      default:
    }


  }
  onReady() {
   // this.youtubeplayer.mute();
    this.youtubeplayer.playVideo();
  }


  onPause(){
    this.youtubeplayer.pauseVideo();
  }


  volumeControl(v:String){
    let volumeLevel:number=this.youtubeplayer.getVolume();
    if(volumeLevel<100 && v=="vol_up")
    {
      volumeLevel=this.youtubeplayer.getVolume();
      volumeLevel=volumeLevel+10;
      this.youtubeplayer.setVolume(volumeLevel);
      this.popUpModalInfo.fire({
        icon: 'info',
        title: 'Volume increased ,Volume level:-'+ volumeLevel +'%'
      })

    }
    else if (volumeLevel<=0 && v=="vol_down"){

      this.popUpModalInfo.fire({
        icon: 'info',
        title: 'Volume lowest,cannot decrease vol level'
      })
    }
    else if(volumeLevel<=100 && v=="vol_down"){
      volumeLevel=this.youtubeplayer.getVolume();
      volumeLevel=volumeLevel-10;
      this.youtubeplayer.setVolume(volumeLevel);
      this.popUpModalInfo.fire({
        icon: 'info',
        title: 'Volume lowered ,Volume level:'+volumeLevel +'%'
      })
    }
    else{
      this.popUpModalInfo.fire({
        icon: 'info',
        title: 'Volume is at max ,Volume level:'+volumeLevel +'%'
      })
    }
  }


  seekForward()
  {
    //playing state is defined by 1
    let elapsedSeconds;
      if(this.youtubeplayer.getPlayerState()==1)
      {

        elapsedSeconds=this.youtubeplayer.getCurrentTime();
        elapsedSeconds= elapsedSeconds +10;
        this.youtubeplayer.seekTo(elapsedSeconds+10,true);
      }
  }

  seekBackward()
  {
    let elapsedSeconds;
    if(this.youtubeplayer.getPlayerState()==1)
    {
      elapsedSeconds=this.youtubeplayer.getCurrentTime();
      if(elapsedSeconds>5)
      this.youtubeplayer.seekTo(elapsedSeconds-5,true);
    }
  }





}
