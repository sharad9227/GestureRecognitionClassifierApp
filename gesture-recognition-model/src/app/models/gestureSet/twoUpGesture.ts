import * as fp from 'fingerpose';


const peaceGesture =new fp.GestureDescription('peaceGesture');

     peaceGesture.addCurl(fp.Finger.Index,fp.FingerCurl.NoCurl, 1.0);
     peaceGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
     peaceGesture.addDirection(fp.Finger.Middle, fp.FingerDirection.DiagonalUpRight, 0.75);
    peaceGesture.addCurl(fp.Finger.Middle,fp.FingerCurl.NoCurl, 1.0);
    peaceGesture.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpLeft, 0.75);
    peaceGesture.addDirection(fp.Finger.Middle, fp.FingerDirection.VerticalUp, 1.0);
    // do this for all other fingers
    peaceGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
    peaceGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
    peaceGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 0);
    peaceGesture.addDirection(fp.Finger.Ring,fp.FingerDirection.DiagonalUpLeft,0);
    peaceGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
    peaceGesture.setWeight(fp.Finger.Index, 1);
    peaceGesture.setWeight(fp.Finger.Middle, 1.5);
    peaceGesture.setWeight(fp.Finger.Ring, 0);

    export default peaceGesture;
