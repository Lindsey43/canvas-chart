//Javascript Document

var total = 0, canvas, context, canvasgraph, contextgraph, lengthTot, pie;

document.addEventListener("DOMContentLoaded", function () {


    var xhr = $.ajax({
        url: "cheese.json",
        type: "GET",
        dataType: "json"
    });
    xhr.done(data)

    xhr.fail(function (jqXHR, textStatus) {
        console.log("Request failed:" + textStatus);
    });
});

function data(tempPie) {
    pie = tempPie;
    lengthTot = pie.segments.length;


    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    

    canvasgraph = document.getElementById("canvasgraph");
    contextgraph = canvasgraph.getContext("2d");

    for (var i = 0; i < lengthTot; i++) {
        total += pie.segments[i].value;
    };


    applepie();
    showCircles();
}
        
        
function applepie(){ 
        //clear the canvas
    //alert("apple pie");
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var radius = 100;
    var currentAngle = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);
        //set the styles in case others have been set

        var cx = canvas.width / 2-30;
        var cy = canvas.height / 2;
        var radius = 100;
        var currentAngle = 0;
        //the difference for each wedge in the pie is arc along the circumference
        //we use the percentage to determine what percentage of the whole circle
        //the full circle is 2 * Math.PI radians long.
        //start at zero and travelling clockwise around the circle
        //start the center for each pie wedge
        //then draw a straight line out along the radius at the correct angle
        //then draw an arc from the current point along the circumference
        //stopping at the end of the percentage of the circumference
        //finally going back to the center point.
        for (var b = 0; b < lengthTot; b++) {
            var pct = pie.segments[b].value / total;

            if (pie.segments[b].value >= 40) {
                radius = 90;
            } else if (pie.segments[b].value <= 4) {
                radius = 110;
            } else {
                radius = 100;
            };

            var endAngle = currentAngle + (pct * (Math.PI * 2));
            //draw the arc
            context.moveTo(cx, cy);
            context.beginPath();
            context.fillStyle = pie.segments[b].color;
            context.arc(cx, cy, radius, currentAngle, endAngle, false);
            context.lineTo(cx, cy);
            context.fill();


            //Now draw the lines that will point to the values
            context.save();
            context.translate(cx, cy); //make the middle of the circle the (0,0) point
            context.strokeStyle = "#000000";
            context.lineWidth = 1.5;
            context.beginPath();
            //angle to be used for the lines
            var midAngle = (currentAngle + endAngle) / 2; //middle of two angles
            context.moveTo(0, 0); //this value is to start at the middle of the circle
            //to start further out...
            var dx = Math.cos(midAngle) * (0.8 * radius);
            var dy = Math.sin(midAngle) * (0.8 * radius);
            context.moveTo(dx, dy);
            //ending points for the lines
            var dx = Math.cos(midAngle) * (radius + 30); //30px beyond radius
            var dy = Math.sin(midAngle) * (radius + 30);
            context.lineTo(dx, dy);
            context.stroke();
            var dx = Math.cos(midAngle) * (radius + 60); //30px beyond radius
            var dy = Math.sin(midAngle) * (radius + 50);

            context.translate(dx,dy);
            context.fillText(pie.segments[b].label,0,0);
            context.stroke();
            //put the canvas back to the original position
            context.restore();
            //update the currentAngle
            currentAngle = endAngle;
        }

};




function showCircles(){
      //clear the canvas
    //alert("show circles");
      contextgraph.clearRect(0, 0, canvasgraph.width, canvasgraph.height);
      //set the styles in case others have been set
      //setDefaultStyles();
      var numPoints = total;	//number of circles to draw.
      var padding = 4;	//space away from left edge of canvas to start drawing.
      var magnifier = 13;	
      var horizontalAxis = canvasgraph.height/2;   //how far apart to make each x value.
      //use the percentage to calculate the height of the next point on the line
      //start at values[1].
      //values[0] is the moveTo point.
      var currentPoint = 0;	//this will become the center of each cirlce.
      var x = 0;
      var y = horizontalAxis;//center y point for circle
      var colour = "#00FF00";
      for(var i=0; i<total; i++){
        //the percentages will be used to create the area of the circles
        //using the radius creates way too big a range in the size
        var pct = Math.round((pie.segments[i].value / total) * 100);
        // the fill colour will be a shade of yellow
        // For shades of yellow the Reds should be E0 - FF, 
        // Greens should be less C0 - D0
        // blues are based on the percentage
        var a = (0xD0 + Math.round(Math.random() * 0x2F));
        var b = (0xD0 + Math.round(Math.random() * 0x2F));
        var red = Math.max(a, b).toString(16);
        var green = Math.min(a, b).toString(16);
        var blue = ( Math.floor(pct * 2.55) ).toString(16); 
        if(red.length==1)red= "0" + red;
        if(green.length==1)green= "0" + green;
        if(blue.length==1)blue="0"+blue;
        colour = "#" + red + green + blue;
        // area = Math.PI * radius * radius
        // radius = Math.sqrt( area / Math.PI );
        var radius = Math.sqrt(pct / Math.PI ) * magnifier; 
        // magnifier makes all circles bigger
        x = currentPoint + padding + radius;
        //center x point for circle
        //draw the circle
        contextgraph.beginPath();
        contextgraph.fillStyle = colour;	
        //colour inside the circle set AFTER beginPath() BEFORE fill()
        contextgraph.strokeStyle = "#333";	//colour of the lines 
        contextgraph.lineWidth = 3;
        contextgraph.arc(x, y, radius, 0, Math.PI * 2, false);
        contextgraph.closePath();
        contextgraph.fill();	//fill comes before stroke
        contextgraph.stroke();
        //to add labels take the same x position but go up or down 30 away from the y value
        //use the percentage to decide whether to go up or down. 20% or higher write below the line		
        var lbl = pct.toString();
        contextgraph.font = "normal 12pt Arial";
        contextgraph.textAlign = "center";
        contextgraph.fillStyle = "#000000";	//colour inside the circle
        contextgraph.beginPath();
        contextgraph.fillText(lbl, x, y+6);
        contextgraph.closePath();
        currentPoint = x + radius;	
        //move the x value to the end of the circle for the next point  
      }
    }
