//import stdio to allow for imnput through node
var stdio = require('stdio');

//import express
var express = require('express');
//create express object named app
var app = express();

//instantiate a server on port 3030
var server = app.listen(3030);

//starts socket.io server
var io = require('socket.io')(server);

//expose the local public folder for inluding files js, css etc..
app.use(express.static('public'));

//on a request to / serve index.html
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

//set the maximum line length
var max_length = 10;

//this listens for text input while node is running
stdio.readByLines(function lineHandler(message, index) {
    // You can do whatever you want with every line

    var texts = wrap(message, max_length);
    var line1 = texts[0];
    var line2 = texts[1];
    var warning = texts[2];

    io.sockets.emit('text', line1);
    io.sockets.emit('text2', line2);

    blank_out();

    for (var i = 0; i < warning.length; i++) {
        console.log(warning[i]);
    }

    console.log("");
    question();
    });


function blank_out() {
    var n = 0;
    while (n<50) {
        n++;
        console.log("");
    }
}

function question() {
    quest = [
        "Type a four word message",
        "that you want to share",
        "with the people in the theater",
        "or the person next to you."
    ];
    for (var i = 0; i < quest.length; i++) {
        console.log(quest[i]);
    }
}

function arrlen(array) {
    var l=0;
    for (var i = 0; i < array.length; i++) {
        l = l + array[i].length;
    }
    return l;

}

function wrap(message, max_width) {
    var words = message.split(" ");
    var line1 = [];
    var line2 = [];
    var flag1 = 0;
    var flag2 = 0;
    var warning = [];

    for (var i = 0; i < words.length; i++) {
        var length_w = words[i].length;
        var length_1 = arrlen(line1);
        var length_2 = arrlen(line2);
        var spaces_1 = line1.length-1;
        var spaces_2 = line2.length-1;

        if (length_w + length_1 + spaces_1 < max_width && flag1 === 0) {
            line1.push(words[i]);
        }
        else if (length_w + length_2 + spaces_2 < max_width) {
            flag1=1;
            line2.push(words[i]);
        }
        else {
            flag2=1;
            warning = [
            "******************************",
            "Try to constrain your messages",
             "to less than " + max_length*2 + " characters,",
             "and avoid using words longer",
             "than " + max_length + " characters.",
             "******************************"
         ];
            // console.log(words[i]);
            // console.log(length_w);
            // console.log(length_1);
            // console.log(length_2);
            break;
        }
    }
    return [line1.join(" "),line2.join(" "), warning];
}
