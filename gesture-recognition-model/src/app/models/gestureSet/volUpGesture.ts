
import * as fp from 'fingerpose';


const volUpGesture = new fp.GestureDescription('vol_up');
  /*three types of curl
  No curl   -  single stretched out finger
  Half curl -  half single stretched out finger
  Full curl - finger curled inside
  */
 //Index
  volUpGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  volUpGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);


  //Thumb
  volUpGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
  volUpGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalLeft, 1.0);
  //tilted
  volUpGesture.addDirection(fp.Finger.Thumb,fp.Finger.DiagonalUpLeft,0.75);


  volUpGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalRight , 1.0);
  //tilted
  volUpGesture.addDirection(fp.Finger.Thumb,fp.Finger.DiagonalUpRight,0.75);

  // do this for all other fingers
  volUpGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  volUpGesture.addDirection(fp.Finger.Middle,fp.FingerDirection.DiagonalUpLeft,0);
  volUpGesture.addDirection(fp.Finger.Middle,fp.FingerDirection.DiagonalUpRight,0)
  volUpGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  volUpGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  volUpGesture.setWeight(fp.Finger.Index,1);




  export default volUpGesture;
