var previousFrame = null;
var currentFrame = null;
var firstFrame = null;
var isWorking = false;
var detectedChangeInterval = -1;
var socket = io();

var TOLERANCE = 200;
var FPS = 500;
var HOLDOUTTIME = 6000;




var video = document.querySelector("#videoElement");
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

video.onloadedmetadata = function() {
}

if (navigator.getUserMedia) {
    if (MediaStreamTrack.getSources) {
        MediaStreamTrack.getSources(gotSources);
    } else {
        startCamera(true);
    }
}

function gotSources(sourceInfos) {
    var audioSource = sourceInfos[0].id;
    var videoSource = sourceInfos[4].id;

    startCamera({
        optional: [{sourceId: videoSource}]
    });
}

function startCamera(video) {
    var constraints = {
        audio: false,
        video: video
    };
    navigator.getUserMedia(constraints, handleVideo, videoError);
}

function handleVideo(stream) {
    video.src = window.URL.createObjectURL(stream);

    setInterval(function() {
        show_video();
    }, FPS);
}

function videoError(e) {
    // do something
    alert(e.message + " " + e.constraint + " " + e.name);
}

function show_video() {
    var back = document.getElementById('output');
    var backcontext = back.getContext('2d');
    var cw = back.width;
    var ch = back.height;
    draw(back, video, backcontext, cw, ch);
}


function draw(back, v, bc, w, h) {

    //bc.clearRect(0, 0, w, h);
    // First, draw it into the backing canvas
    bc.drawImage(v, 0, 0, w, h);

    var imgData = bc.getImageData(0,0,w,h).data;

    // enumerate all pixels
    // each pixel's r,g,b,a datum are stored in separate sequential array elements

    //if (isWorking) return;

    if (previousFrame) {

        currentFrame = imgData;


        var deltaImage = compare(previousFrame, currentFrame, w, h);

        if (deltaImage) {

            previousFrame = currentFrame.slice(0);
            var deltaWidth = deltaImage.max_x-deltaImage.min_x;
            var deltaHeight = deltaImage.max_y-deltaImage.min_y;

            outputBoxcontext.clearRect(0, 0, w, h);
            outputBoxcontext.beginPath();
            outputBoxcontext.strokeStyle="red";
            outputBoxcontext.rect(deltaImage.min_x,deltaImage.min_y,deltaWidth,deltaHeight);
            outputBoxcontext.stroke();
            outputBoxcontext.closePath();


            //jQuery(".cameraLoading > div").stop().css('width','0%');
            //clearTimeout(detectedChangeInterval);

            if (!isWorking) {

                isWorking = true;

                jQuery(".cameraLoading > div").stop().css('width','0%').animate({width: '100%'}, HOLDOUTTIME);
                detectedChangeInterval = setTimeout(function() {
                    isWorking = false;
                    jQuery(".cameraLoading > div").stop().css('width','0%');

                    var deltaImage = compare(firstFrame || previousFrame, currentFrame, w, h);
                    firstFrame = currentFrame.slice(0);

                    if (deltaImage != null) {
                        var deltaWidth = deltaImage.max_x-deltaImage.min_x;
                        var deltaHeight = deltaImage.max_y-deltaImage.min_y;

                        outputBoxcontext.clearRect(0, 0, w, h);
                        outputBoxcontext.beginPath();
                        outputBoxcontext.strokeStyle="red";
                        outputBoxcontext.rect(deltaImage.min_x,deltaImage.min_y,deltaWidth,deltaHeight);
                        outputBoxcontext.stroke();
                        outputBoxcontext.closePath();

                        var subImgData = bc.getImageData(deltaImage.min_x, deltaImage.min_y, deltaWidth, deltaHeight);
                        var canvas = document.createElement('canvas');
                        canvas.width = deltaWidth;
                        canvas.height = deltaHeight;
                        var ctx = canvas.getContext('2d');
                        ctx.putImageData(subImgData, 0, 0);

                        // send deltaImage to server
                        socket.emit('image', {
                            'image' : canvas.toDataURL()
                        });
                    } else {

                    }
                }, HOLDOUTTIME);
            }
        }

    } else {
        previousFrame = imgData;
    }
}


function compare(data1, data2, w, h) {

    var data1Arr = data1;//data1.data;
    var data2Arr = data2;//data2.data;
    var min_x = w;
    var max_x = 0;
    var min_y = h;
    var max_y = 0;

    for(var i=0; i<data1Arr.length; i+=4) {

        var x = (i / 4) % w;
        var y = Math.floor((i / 4) / w);

        var c1 = {
            'getRed' : data1Arr[i],
            'getGreen' : data1Arr[i+1],
            'getBlue' : data1Arr[i+2],
            'getAlpha' : data1Arr[i+3]
        };
        var c2 = {
            'getRed' : data2Arr[i],
            'getGreen' : data2Arr[i+1],
            'getBlue' : data2Arr[i+2],
            'getAlpha' : data2Arr[i+3]
        };
        var distance = colorDistance(c1, c2);

        if (distance > TOLERANCE) {
            min_x = min_x > x ? x : min_x;
            max_x = max_x < x ? x : max_x;
            min_y = min_y > y ? y : min_y;
            max_y = max_y < y ? y : max_y;
            //data2Arr[i] = 255;
            //data2Arr[i+1] = 0;
            //data2Arr[i+2] = 0;
        }
    }

    //var c = document.getElementById('test2');
    //var ctx = c.getContext('2d');
    //ctx.putImageData(data2, 0, 0);

    if (min_x==w && max_x==0 && min_y==h && max_y==0) {
        return null;
    }

    return {
        'min_x':min_x,
        'max_x':max_x,
        'min_y':min_y,
        'max_y':max_y
    };
}


function colorDistance(color1, color2) {
    var rmean = ( color1.getRed + color2.getRed )/2;
    var r = color1.getRed - color2.getRed;
    var g = color1.getGreen - color2.getGreen;
    var b = color1.getBlue - color2.getBlue;
    var weightR = 2 + rmean/256;
    var weightG = 4.0;
    var weightB = 2 + (255-rmean)/256;
    return Math.sqrt(weightR*r*r + weightG*g*g + weightB*b*b);
}


var outputBox = document.getElementById('outputBox');
var outputBoxcontext = outputBox.getContext('2d');



/*
 function make_base(canvas, path, callback) {
 var context = canvas.getContext('2d');
 var cw = canvas.width;
 var ch = canvas.height;
 var base_image = new Image();
 base_image.src = path;
 base_image.onload = function() {
 context.drawImage(base_image, 0, 0, cw, ch);
 var imgData = context.getImageData(0,0,cw,ch);
 callback(imgData);
 }
 }


 var canvas = document.getElementById('test1');
 var canvas2 = document.getElementById('test2');


 make_base(canvas, "20170121_132227.jpg", function(data1) {
 make_base(canvas2, "20170121_132225.jpg", function(data2) {
 var deltaImage = compare(data1, data2, canvas.width, canvas.height);
 var context = canvas2.getContext('2d');

 if (deltaImage) {
 context.beginPath();
 context.strokeStyle="red";
 //context.rect(0,0,100,100);
 context.rect(deltaImage.min_x,deltaImage.min_y,deltaImage.max_x-deltaImage.min_x,deltaImage.max_y-deltaImage.min_y);
 context.stroke();
 context.closePath();
 }
 });
 });
 */