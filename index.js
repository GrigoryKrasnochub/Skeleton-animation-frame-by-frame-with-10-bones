var Frames = [];

window.onload = function () {
    document.getElementById('import').addEventListener('change', handleFileSelectSingle, false);

    var inputs = document.getElementsByClassName("Input");

    for (let el of inputs) {
        el.onchange = function () {
            var inputs = document.getElementsByClassName("Input");
            var angles = [];
            for (let el of inputs) {
                var val = el.value === "" ? "0" : el.value;
                angles.push(parseInt(el.value));
            }

            Draw(angles);
        }
    }
    inputs[9].onchange();

};


function Draw(angles) {

    var example = document.getElementById("example"),
        ctx = example.getContext('2d');
    example.height = 400;
    example.width = 640;
    ctx.strokeStyle = '#B70A02'; // меняем цвет рамки
    ctx.beginPath();

    moveTo1 = function (point1) {
        ctx.moveTo(point1.x, point1.y);
    };
    lineTo1 = function (point1) {
        ctx.lineTo(point1.x, point1.y);
    };

    var XX = 200;
    var YY = 40;
    var LEN = 30;

    // голова
    var point4 = new Line(XX, YY, angles[2], LEN);
    var point5 = point4.calculateNewPoint();
    moveTo1(point4);
    lineTo1(point5);

    // втаз
    var point6 = new Line(XX, YY + 5, angles[3], LEN * 2);
    var point7 = point6.calculateNewPoint();
    moveTo1(point6);
    lineTo1(point7);

    // рука право
    // TODO point1 перпендикулярно point4
    var xx2 = parseFloat(point4.x) + 20 * Math.cos(toRadians(90 - angles[3]));
    var yy2 = parseFloat(point4.y) - 20 * Math.cos(toRadians(90 - (90 - angles[3])));

    // var point1 = new Line(point4.x + 20,point4.y, angles[0], LEN);
    var point1 = new Line(parseInt(xx2), parseInt(yy2), angles[0], LEN);
    var point2 = point1.calculateNewPoint();
    point2.setAngle(angles[1]);
    var point3 = point2.calculateNewPoint();
    moveTo1(point1);
    lineTo1(point2);
    lineTo1(point3);

    // рука лево
    // TODO point8 перпендикулярно point4
    var xx3 = parseFloat(point4.x) - 20 * Math.cos(toRadians(90 - angles[3]));
    var yy3 = parseFloat(point4.y) + 20 * Math.cos(toRadians(90 - (90 - angles[3])));

    //var point8 = new Line(point4.x - 20,point4.y,angles[4],LEN);
    var point8 = new Line(parseInt(xx3), parseInt(yy3), angles[4], LEN);
    var point9 = point8.calculateNewPoint();
    point9.setAngle(angles[5]);
    var point10 = point9.calculateNewPoint();
    moveTo1(point8);
    lineTo1(point9);
    lineTo1(point10);

    // нога право
    // TODO аналогично
    var xx4 = parseFloat(point7.x) + 20 * Math.cos(toRadians(90 - angles[3]));
    var yy4 = parseFloat(point7.y) - 20 * Math.cos(toRadians(90 - (90 - angles[3])));
    var point71 = new Line(parseInt(xx4), parseInt(yy4), angles[6], LEN);
    // point7.setAngle(angles[6]);
    // var point11 = point7.calculateNewPoint();
    var point11 = point71.calculateNewPoint();
    point11.setAngle(angles[7]);
    var point12 = point11.calculateNewPoint();
    // moveTo1(point7);
    moveTo1(point71);
    lineTo1(point11);
    lineTo1(point12);

    // нога лево
    // TODO аналогично
    var xx5 = parseFloat(point7.x) - 20 * Math.cos(toRadians(90 - angles[3]));
    var yy5 = parseFloat(point7.y) + 20 * Math.cos(toRadians(90 - (90 - angles[3])));
    var point72 = new Line(parseInt(xx5), parseInt(yy5), angles[8], LEN);

    // point7.setAngle(angles[8]);
    // var point13 = point7.calculateNewPoint();
    var point13 = point72.calculateNewPoint();
    point13.setAngle(angles[9]);
    var point14 = point13.calculateNewPoint();
    // moveTo1(point7);
    moveTo1(point72);
    lineTo1(point13);
    lineTo1(point14);
    ctx.stroke();
}

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

function toRadians(angle) {
    return parseFloat(angle * (Math.PI / 180));
}

function saveFrame() {
    var inputs = document.getElementsByClassName("Input");
    var angles = [];
    for (let el of inputs) {
        el.value = el.value === "" ? "0" : el.value;
        angles.push(parseInt(el.value));
    }
    var element = document.getElementById('frameCounter');
    var currentFrame = parseInt(element.textContent);
    Frames[currentFrame]=angles;
}

function exportFrames() {
    let data = '';
    for (let i = 0; i < Frames.length; i++) {
        for (let j = 0; j < Frames[i].length; j++) {
            data += `${i},${j},${Frames[i][j]}\n`
        }
    }
    console.log(data);
    var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "frames.txt");
}


function handleFileSelectSingle(evt) {
    var file = evt.target.files;

    var f = file[0];

    // Only process image files.
    // if (!f.type.match('image.*')) {
    //     alert("Только изображения....");
    // }

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) {
            // Render thumbnail.
            var contents = reader.result;
            var lines = contents.split('\n');
            importFrames(lines);
            console.log(contents);
        };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsText(f);
}

function importFrames(lines) {
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let el = line.split(",");
        let fr = parseInt(el[0]);
        let num = parseInt(el[1]);
        let ang = parseInt(el[2]);
        if (fr in Frames) {
        } else {
            Frames[fr] = [];
        }
        Frames[fr][num] = ang;
    }
}

function playFrames() {
    var element = document.getElementById('frameCounter');
    element.textContent = parseInt(0);
    var timerId = setInterval(function () {
        var el = document.getElementById('frameCounter');
        var c = parseInt(el.textContent);

        if (c >= Frames.length) {
            clearInterval(timerId);
            return;
        }
        addFrameNumber();
    }, 1000 / 50)
}

function removeFrameNumber() {
    var element = document.getElementById('frameCounter');
    element.textContent = parseInt(element.textContent) - 1;
    frameChanged(element.textContent);
}

function addFrameNumber() {
    var element = document.getElementById('frameCounter');
    element.textContent = parseInt(element.textContent) + 1;
    frameChanged(element.textContent);
}

function frameChanged(frameNumber) {
    frameNumber = parseInt(frameNumber);
    var inputs = document.getElementsByClassName("Input");
    if (frameNumber in Frames) {
        for (let i = 0; i < Frames[frameNumber].length; i++) {
            //Frames[frameNumber][i] === undefined
            inputs[i].value = Frames[frameNumber][i];
        }
        inputs[9].onchange();
    }
}

class Line {

    constructor(x, y, angle, length) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.angle = angle;
    }

    setAngle(angle) {
        this.angle = angle;
    }

    newLinePoint(x, y) {
        return new Line(x, y, 0, 30)
    }

    calculateNewPoint() {
        var x2 = parseFloat(this.x) + Math.cos(this.angle * (Math.PI / 180)) * this.length;
        var y2 = parseFloat(this.y) + Math.sin(this.angle * (Math.PI / 180)) * this.length;
        return this.newLinePoint(parseInt(x2), parseInt(y2))
    }
}
