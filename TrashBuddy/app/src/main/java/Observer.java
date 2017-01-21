/**
 * Created by Ali on 2017-01-20.
 */

public class Observer {
    public image compare(image previous, image current){
        for (int i=0; i < previous.length; i++){
            for (int j=0; j < previous.width; j++){
                if (colorDistance(previous.pixelAt(i, j).getColor, current.pixelAt(i, j).getColor)
                        != 0){
                    return current;
                }
            }
        }
        return null;
    }
    public static double colorDistance(MyColor color1, MyColor color2) {
        double rmean = ( color1.getRed() + color2.getRed() )/2;
        int r = color1.getRed() - color2.getRed();
        int g = color1.getGreen() - color2.getGreen();
        int b = color1.getBlue() - color2.getBlue();
        double weightR = 2 + rmean/256;
        double weightG = 4.0;
        double weightB = 2 + (255-rmean)/256;
        return Math.sqrt(weightR*r*r + weightG*g*g + weightB*b*b);
    }
}
