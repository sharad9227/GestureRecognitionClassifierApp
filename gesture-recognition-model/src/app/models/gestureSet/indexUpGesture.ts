
import * as fp from 'fingerpose';

const indexUpFinger =new fp.GestureDescription('index_up');
indexUpFinger.addCurl(fp.Finger.Index,fp.FingerCurl.NoCurl, 1.0);
indexUpFinger.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
// do this for all other fingers
indexUpFinger.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
indexUpFinger.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
indexUpFinger.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
indexUpFinger.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
indexUpFinger.setWeight(fp.Finger.Index, 2);


export default indexUpFinger;
