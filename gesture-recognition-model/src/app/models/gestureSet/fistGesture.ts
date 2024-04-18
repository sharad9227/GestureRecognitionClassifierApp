import * as fp from 'fingerpose';

const fistGesture =new fp.GestureDescription('fist');
fistGesture.addCurl(fp.Finger.Index,fp.FingerCurl.FullCurl, 1.0);
fistGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
fistGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);

fistGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
fistGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);

export default fistGesture;
