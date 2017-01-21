

import android.graphics.Bitmap;

public class Observer {

    private Bitmap previousFrame;
    private Bitmap currentFrame;

    public Observer(){
        previousFrame = null;
        currentFrame = null;
    }
    public void run(CameraView view){
        if (this.previousFrame == null){
            previousFrame = view.getFrame();
            currentFrame = view.getFrame();
        }else {
            if (currentFrame == Comparator.compare(previousFrame, currentFrame)){
                previousFrame = currentFrame;
                currentFrame = view.getFrame();
            }
        }
    }
}
