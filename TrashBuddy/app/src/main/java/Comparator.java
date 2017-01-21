
import android.graphics.Bitmap;
import android.graphics.Color;

public class Comparator {
    public static Bitmap compare(Bitmap previous, Bitmap current){
        for (int i=0; i < previous.getHeight(); i++){
            for (int j=0; j < previous.getWidth(); j++){
                    int pixel1 = previous.getPixel(i, j);
                    int pixel2 = previous.getPixel(i, j);
                    int[] color1 = {Color.red(pixel1), Color.green(pixel1), Color.blue(pixel1)};
                    int[] color2 = {Color.red(pixel2), Color.green(pixel2), Color.blue(pixel2)};
                if (colorDistance(color1, color2) != 0){
                    return current;
                }
            }
        }
        return null;
    }
    private static double colorDistance(int[] color1, int[] color2) {
        double rmean = ( color1[0] + color2[0] )/2;
        int r = color1[0] - color2[0];
        int g = color1[1] - color2[1];
        int b = color1[2] - color2[2];
        double weightR = 2 + rmean/256;
        double weightG = 4.0;
        double weightB = 2 + (255-rmean)/256;
        return Math.sqrt(weightR*r*r + weightG*g*g + weightB*b*b);
    }
}
