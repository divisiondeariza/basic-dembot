import React from 'react';
import ReactDOM from 'react-dom';
import Sketch from 'react-p5'


//Now draw the piano roll
var NUM_STEPS = 32;
var NUM_NOTES = 88;
var MIDI_START_NOTE = 21;
var TILE_SIZE = 150;
var WIDTH = 500;
var HEIGHT = 170;
var START_COLOR;
var END_COLOR;


const setup = (p5, canvasParentRef) => {
  console.log(canvasParentRef);
  p5.createCanvas(WIDTH , HEIGHT).parent(canvasParentRef);
  START_COLOR = p5.color(60, 180, 203);
  END_COLOR = p5.color(233, 72, 88);
  p5.noStroke();
}

const draw = (p5, notes) => {
  var x = 0;
  var y = HEIGHT -TILE_SIZE;

  var currColor = p5.lerpColor(START_COLOR, END_COLOR, 0);

  //use currColor but at 50% opacity
  p5.fill(p5.red(currColor), p5.green(currColor), p5.blue(currColor), 125);
  p5.fill(currColor);
  if(notes){
    drawNotes(p5, notes, x, y, TILE_SIZE, TILE_SIZE);
  }
  p5.fill(255, 64);
}

const drawNotes = (p5, notes, x, y, width, height) => {
    p5.push();
    p5.translate(x, y);
    var cellWidth = width / NUM_STEPS;
    var cellHeight = height / NUM_NOTES;
    notes.forEach(function(note) {
        var emptyNoteSpacer = 1;
        p5.rect(emptyNoteSpacer + cellWidth * note.quantizedStartStep, height - cellHeight * (note.pitch - MIDI_START_NOTE),
            cellWidth * (note.quantizedEndStep - note.quantizedStartStep) - emptyNoteSpacer, cellHeight);
    });
    p5.pop();
}

class PianoRoll extends React.Component {

  render() {
    return (
        <Sketch setup={(p5, canvasParentRef) => setup(p5, canvasParentRef)} draw={(p5) => draw(p5, this.props.notes)} />
   )
  }
}

export default PianoRoll;
