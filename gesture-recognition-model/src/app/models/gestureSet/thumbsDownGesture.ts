import * as fp from 'fingerpose';


const thumbsDownGesture = new fp.GestureDescription('thumbs_down');


/*three types of curl
No curl   -  single stretched out finger
Half curl -  half single stretched out finger
Full curl - finger curled inside
*/
thumbsDownGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
thumbsDownGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalDown, 1.0);
// do this for all other fingers
thumbsDownGesture.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
thumbsDownGesture.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
thumbsDownGesture.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
thumbsDownGesture.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);



export default thumbsDownGesture;
