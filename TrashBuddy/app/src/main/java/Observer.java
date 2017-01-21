
import android.graphics.Bitmap;
import java.util.concurrent.TimeUnit;
import java.net.URLConnection;
import org.apache.http.params.HttpConnectionParams;

public class Observer {

    private Bitmap previousFrame;
    private Bitmap currentFrame;
    private boolean keepRun = true;
    private static String url;

    public Observer(){
        previousFrame = null;
        currentFrame = null;
    }
    public void run(CameraView view) {
        while (keepRun) {
            try {
                TimeUnit.SECONDS.sleep(3);
                if (this.previousFrame == null) {
                    previousFrame = view.getFrame();
                } else {
                    currentFrame = view.getFrame();
                    deltaImage == Comparator.compare(previousFrame, currentFrame);

                    if (deltaImage) {
                        previousFrame = currentFrame;
                        
                    }
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
                System.out.println("Interrupted while waiting");
            }
        }
    }
    public Bitmap getPreviousFrame(){
        return this.previousFrame;
    }
    public Bitmap getCurrentFrame(){
        return this.currentFrame;
    }
    public void stopRunning(){
        this.keepRun = false;
    }
}
