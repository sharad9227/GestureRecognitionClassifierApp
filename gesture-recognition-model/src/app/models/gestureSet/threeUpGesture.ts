import * as fp from 'fingerpose';


const threeFingersUpGesture =new fp.GestureDescription('threeFingers');

    threeFingersUpGesture.addCurl(fp.Finger.Index,fp.FingerCurl.NoCurl, 1.0);
    threeFingersUpGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
    threeFingersUpGesture.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpLeft, 0.75);
    //Middle
    threeFingersUpGesture.addCurl(fp.Finger.Middle,fp.FingerCurl.NoCurl, 1.0);
    threeFingersUpGesture.addDirection(fp.Finger.Middle, fp.FingerDirection.DiagonalUpRight, 0.75);
    threeFingersUpGesture.addDirection(fp.Finger.Middle, fp.FingerDirection.VerticalUp, 1.0);
    //Ring
    threeFingersUpGesture.addCurl(fp.Finger.Ring,fp.FingerCurl.NoCurl, 1.0);
    threeFingersUpGesture.addDirection(fp.Finger.Ring, fp.FingerDirection.DiagonalUpRight, 0.75);
    threeFingersUpGesture.addDirection(fp.Finger.Ring, fp.FingerDirection.VerticalUp, 1.0);


   //all other fingers



    threeFingersUpGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
    threeFingersUpGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
    threeFingersUpGesture.setWeight(fp.Finger.Index, 2);
    threeFingersUpGesture.setWeight(fp.Finger.Middle, 2);








    export default threeFingersUpGesture;
