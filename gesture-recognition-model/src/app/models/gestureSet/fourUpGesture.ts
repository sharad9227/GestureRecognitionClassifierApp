import * as fp from 'fingerpose';


const fourFingersUpGesture =new fp.GestureDescription('fourFingers');

    fourFingersUpGesture.addCurl(fp.Finger.Index,fp.FingerCurl.NoCurl, 1.0);
    fourFingersUpGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
    fourFingersUpGesture.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpLeft, 0.75);
    //Middle
    fourFingersUpGesture.addCurl(fp.Finger.Middle,fp.FingerCurl.NoCurl, 1.0);
    fourFingersUpGesture.addDirection(fp.Finger.Middle, fp.FingerDirection.DiagonalUpRight, 0.75);
    fourFingersUpGesture.addDirection(fp.Finger.Middle, fp.FingerDirection.VerticalUp, 1.0);
    //Ring
    fourFingersUpGesture.addCurl(fp.Finger.Ring,fp.FingerCurl.NoCurl, 1.0);
    fourFingersUpGesture.addDirection(fp.Finger.Ring, fp.FingerDirection.DiagonalUpRight, 0.75);
    fourFingersUpGesture.addDirection(fp.Finger.Ring, fp.FingerDirection.VerticalUp,0.75);

    //Pinky

   fourFingersUpGesture.addCurl(fp.Finger.Pinky,fp.FingerCurl.NoCurl, 1.0);
   fourFingersUpGesture.addDirection(fp.Finger.Pinky, fp.FingerDirection.DiagonalUpRight, 0.75);
   fourFingersUpGesture.addDirection(fp.Finger.Ring, fp.FingerDirection.VerticalUp, 0.75);
//Thumb
    fourFingersUpGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);

//Setting weights
    fourFingersUpGesture.setWeight(fp.Finger.Index,2);
    fourFingersUpGesture.setWeight(fp.Finger.Middle,2);
    fourFingersUpGesture.setWeight(fp.Finger.Ring,2);

    export default fourFingersUpGesture;
