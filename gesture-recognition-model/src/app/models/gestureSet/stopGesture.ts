import * as fp from 'fingerpose';


const stopGesture =new fp.GestureDescription('stopGesture');

    stopGesture.addCurl(fp.Finger.Index,fp.FingerCurl.NoCurl, 1.0);
    stopGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
    stopGesture.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpLeft, 0.75);
    //Middle
    stopGesture.addCurl(fp.Finger.Middle,fp.FingerCurl.NoCurl, 1.0);
    stopGesture.addDirection(fp.Finger.Middle, fp.FingerDirection.DiagonalUpRight, 0.75);
    stopGesture.addDirection(fp.Finger.Middle, fp.FingerDirection.VerticalUp, 1.0);
    //Ring
    stopGesture.addCurl(fp.Finger.Ring,fp.FingerCurl.NoCurl, 1.0);
    stopGesture.addDirection(fp.Finger.Ring, fp.FingerDirection.DiagonalUpRight, 0.75);
    stopGesture.addDirection(fp.Finger.Ring, fp.FingerDirection.VerticalUp,0.75);

    //Pinky

   stopGesture.addCurl(fp.Finger.Pinky,fp.FingerCurl.NoCurl, 1.0);
   stopGesture.addDirection(fp.Finger.Pinky, fp.FingerDirection.DiagonalUpRight, 0.75);
   stopGesture.addDirection(fp.Finger.Ring, fp.FingerDirection.VerticalUp, 0.75);
    //Thumb
    stopGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
    //left hand
    stopGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 0.75);
    stopGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalRight , 0.75);
    //right hand
    stopGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 0.75);
    stopGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalLeft , 0.75);
   //setting weeights
    stopGesture.setWeight(fp.Finger.Index,2);
    stopGesture.setWeight(fp.Finger.Middle,2);
    stopGesture.setWeight(fp.Finger.Ring,2);

    export default stopGesture;
