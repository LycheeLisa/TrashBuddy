/**
 * Created by Ali on 2017-01-20.
 */
import

public class Observer {
    public image compare(image previous, image current){
        for (int i=0; i < previous.length; i++){
            for (int j=0; j < previous.width; j++){
                if (previous.pixelAt(i, j).getRGB() != current.pixelAt(i,j).getRGB){
                    return current;
                }
            }
        }
        return null;
    }
}
