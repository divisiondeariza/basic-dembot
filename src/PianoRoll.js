import React from 'react';
import Sketch from 'react-p5'
import Tone from "tone";

//Now draw the piano roll
var NUM_STEPS = 64; // 32 per bar
var STEPS_PER_BAR = 32;
var NUM_NOTES = 88;
var MIDI_START_NOTE = 21;
var TILE_SIZE = 150;
var WIDTH = 1000;
var HEIGHT = 170;
var START_COLOR;
var END_COLOR;
var sequenceIndex = -1;
var stepIndex = -1;



const setup = (p5, canvasParentRef) => {
  console.log(canvasParentRef);
  p5.createCanvas(WIDTH , HEIGHT).parent(canvasParentRef);
  START_COLOR = p5.color(60, 180, 203);
  END_COLOR = p5.color(233, 72, 88);
  p5.noStroke();
}

const draw = (p5, notes) => {
  var num_bars = countBars(notes);
  var NUM_STEPS = STEPS_PER_BAR*num_bars
  var x = 0;
  var y = HEIGHT -TILE_SIZE;

  //here we calculate the percentage through melodies, between 0-1
  var totalPlayTime = (Tone.Transport.bpm.value * NUM_STEPS ) / 1000;
  var percent = Tone.Transport.seconds / totalPlayTime % 1;

  //here we calculate the index of interpolatedNoteSequences
  //and currStepIndex is the note between 0-31 of that playback
  var currSequenceIndex = Math.floor(percent);
  var currStepIndex = Math.floor((percent  - currSequenceIndex) * NUM_STEPS);
  function isCurrentStep(note) {
    return note.quantizedStartStep === currStepIndex;
  }
  if(Tone.Transport.state === 'started') { //playback started
    if(currStepIndex != stepIndex) {
      //here we search through all notes and find any that match our current step index
      var notes = notes.filter(isCurrentStep);
      p5.push();
      p5.fill(255, 204, 0);
      notes.forEach(function(note) {
        var noteDuration = note.quantizedEndStep - note.quantizedStartStep;
        playNote(note.pitch, noteDuration);
        drawNotes(p5, notes, x, y, TILE_SIZE * num_bars, TILE_SIZE);
      });
      p5.pop();
    }
    sequenceIndex = currSequenceIndex;
    stepIndex = currStepIndex;
  }
  
  var currColor = p5.lerpColor(START_COLOR, END_COLOR, 0);

  //use currColor but at 50% opacity
  p5.fill(p5.red(currColor), p5.green(currColor), p5.blue(currColor), 125);
  p5.fill(currColor);
  var notes_off = notes.filter(note => !isCurrentStep(note));
  if(notes_off){
    drawNotes(p5, notes_off, x, y, TILE_SIZE * num_bars, TILE_SIZE);
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


  function togglePlayback(){
      // if(!interpolatedNoteSequences || !players) {
      //     return;
      // }
      if(Tone.Transport.state === 'started') {
          Tone.Transport.stop();
      } else {
          Tone.Transport.start();
      }
  }

  function countBars(notes){
    return Math.ceil(Math.max.apply(
      null,
      notes.map((note) => note.quantizedEndStep)
    ) / STEPS_PER_BAR);
  }

  var samplesPath = 'https://storage.googleapis.com/melody-mixer/piano/';
  var samples = {};
  var NUM_NOTES = 88;
  var MIDI_START_NUM = 21;
  for (var i = MIDI_START_NUM; i < NUM_NOTES + MIDI_START_NUM; i++) {
      samples[i] = samplesPath + i + '.mp3';
  }

  var players = new Tone.Players(samples, function onPlayersLoaded(){
      console.log("Tone.js players loaded");
  }).toMaster();

  const playNote = (midiNote, numNoteHolds) => {
     var duration = Tone.Transport.toSeconds('8n') * (numNoteHolds || 1);
     var player = players.get(midiNote);
     player.fadeOut = 0.05;
     player.fadeIn = 0.01;
     player.start(Tone.now(), 0, duration);
  }


class PianoRoll extends React.Component {

  render() {
    return (
      <div>
        <button type="button" onClick={ togglePlayback } >play</button>
        <Sketch setup={(p5, canvasParentRef) => setup(p5, canvasParentRef)} draw={(p5) => draw(p5, this.props.notes)} />
      </div>   )
  }
}

export default PianoRoll;
