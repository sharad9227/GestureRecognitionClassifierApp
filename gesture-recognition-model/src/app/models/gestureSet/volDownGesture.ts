import * as fp from 'fingerpose';


const volDownGesture = new fp.GestureDescription('vol_down');


/*three types of curl
No curl   -  single stretched out finger
Half curl -  half single stretched out finger
Full curl - finger curled inside
*/
volDownGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
volDownGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalDown, 1.0);


  //Thumb
  volDownGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
  volDownGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalLeft, 1.0);
  //tilted
  volDownGesture.addDirection(fp.Finger.Thumb,fp.Finger.DiagonalUpLeft,0.5);


  volDownGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalRight , 1.0);
  //tilted
  volDownGesture.addDirection(fp.Finger.Thumb,fp.Finger.DiagonalUpRight,0.5);

  // do this for all other fingers
  volDownGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  volDownGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  volDownGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  volDownGesture.setWeight(fp.Finger.Index,2);




export default volDownGesture;
