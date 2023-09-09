// 使用 jQuery
(function($){
    var cv = document.getElementById("fileCv"),ctx = cv.getContext('2d'),w, h, 
    dataURL;

     $(document).ready(function(){
        init();
    });

    function init() {
            $('#upload').on('change', upload);
            // the buttom on touch do switch
            $('input[name="effect"]:radio').on('change', function(e){
                switchRadio(e.currentTarget.value);
            });
            $('#save').on('click', saveImg);
    
            /*
            $("#briteness").on('slidechange', function(event, ui) {
                briteness(ui);
            });*/
            
    }
    //trans file to url & draw on canvas
    function upload() {
        if (window.File && window.FileReader) {
            var reader = new FileReader(),
                file = this.files[0];

            if (!this.files.length) return;
            if (!file.type.match(/image\/\w+/)) {
                alert("Please select an image!");
                return;
            }

            e=reader.readAsDataURL(file);
            reader.onload = function(e) {
                dataURL = e.target.result;
                console.log(dataURL);
                drawfile();
            };
        } else {
            alert('This browser does not support File API');
        }
    }
    //url convert to pic
    function drawfile() {
        var img_f = new Image();
        if (dataURL) {
            img_f.src = dataURL;

            img_f.onload = function() {
                w = cv.width = img_f.width;
                h = cv.height = img_f.height;

                ctx.clearRect(0, 0, w, h);
                ctx.drawImage(img_f, 0, 0, w, h);
            };
        }
    }
    //to activate the function
    function switchRadio(value){
        //to get color from canvas
        var imageData = ctx.getImageData(0, 0, w, h),
            data = imageData.data;
            console.log(imageData);
        
        switch(value){
            case 'reset':
                drawfile(); 
                break;//hehe
            case 'monochrome':
                monochrome(data);
                break;
            case 'sepia':
                sepia(data);
                break;
            case 'reverse':
                reverse(data);
                break;
            default:
                break;
        }
        ctx.putImageData(imageData, 0, 0);//execute
    }
    function monochrome(data){
        var r,g,b,
            grayScale;

        for(var i = 0, n = data.length; i < n; i+=4){
            //set name
            r = data[i]; g = data[i+1]; b = data[i+2];

            //set argument
            grayScale = parseInt(( r*30 + g*65 + b*11 ) / 100);//g 59
            //adjust rgb
            data[i] = grayScale;
            data[i + 1] = grayScale;
            data[i + 2] = grayScale;
        }
    }
    function sepia(data){
        var r,g,b,
            grayScale;

        for(var i = 0, n = data.length; i < n; i+=4){
            r = data[i];
            g = data[i+1];
            b = data[i+2];

            
            grayScale = parseInt(( r*30 + g*59 + b*11 ) / 100);

            // red
            data[i] = (grayScale/255)*290;
            // green
            data[i+1] = (grayScale/255)*200;
            // blue
            data[i+2] = (grayScale/255)*145;
        }

    }
    //Complement color
    function reverse(data){

        for(var i = 0, n = data.length; i < n; i+=4){
            // Red
            data[i] = 255-data[i];
            // Green
            data[i + 1] = 255-data[i+1];
            // Nlue
            data[i + 2] = 255-data[i+2];
        }
    }
    function saveImg(){
        var a=document.createElement('a');//creat a obj
        a.href=cv.toDataURL();//get canvas url
        a.download='result.png';//get name
        a.click();//download
    }
})(jQuery);
