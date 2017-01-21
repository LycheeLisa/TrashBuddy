
import android.graphics.Bitmap;
import android.graphics.Color;

public class Comparator {
    private static int min_x, max_x, min_y, max_y = 0;

    public static Bitmap compare(Bitmap previous, Bitmap current){
        for (int i=0; i < previous.getHeight(); i++){
            for (int j=0; j < previous.getWidth(); j++){
                int pixel1 = previous.getPixel(i, j);
                int pixel2 = previous.getPixel(i, j);
                int[] color1 = {Color.red(pixel1), Color.green(pixel1), Color.blue(pixel1)};
                int[] color2 = {Color.red(pixel2), Color.green(pixel2), Color.blue(pixel2)};
                if (colorDistance(color1, color2) > 50){
                    min_x = min_x > j ? j : min_x;
                    max_x = max_x < j ? j : max_x;
                    min_y = min_y > i ? i : min_y;
                    max_y = max_y < i ? i : max_y;
                }
            }
        }
        if (min_y == 0 && max_y == 0 && min_y == 0 && max_y ==0) {
            return null;
        }else {
            int width = max_x - min_x;
            int height = max_y - min_y;
            return Bitmap.createBitmap(current, min_x, min_y, width, height);
        }
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
