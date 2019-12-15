import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as mm from '@magenta/music';
import Async from "react-async"
import Sketch from 'react-p5'

class PlayTrio extends React.Component {
    constructor(props) {
      super(props);
      this.state = {samples: []};
    }

    render() {
      const model = new mm.MusicVAE( 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/trio_4bar');
      const player = new mm.Player();

      const init_model = async ({model}) => {
        return await model.initialize();
      }


      const generate_samples = async() => {
        var samples = await model.sample(1);
        this.setState({samples: [...this.state.samples, ...samples]})
        //console.log(samples[0].notes)
      }

      const play = async () => {
        if(this.state.samples) {
            player.resumeContext();
            player.start(this.state.samples[0])
          };
      }

      const play_sample = async (sample) => {
            player.resumeContext();
            player.start(sample)
      }


      //Now draw the piano roll
      var NUM_STEPS = 32;
      var NUM_NOTES = 88;
      var MIDI_START_NOTE = 21;
      var TILE_SIZE = 150;
      var WIDTH = 500;
      var HEIGHT = 170;
      var START_COLOR;
      var END_COLOR;

      // let x = 50
      // let y = 50

      const setup = (p5, canvasParentRef) => {
        p5.createCanvas(WIDTH , HEIGHT);
        START_COLOR = p5.color(60, 180, 203);
        END_COLOR = p5.color(233, 72, 88);
        p5.noStroke();
      }

      const draw = (p5, sample) => {
        var x = 0;
        var y = HEIGHT -TILE_SIZE;

        var currColor = p5.lerpColor(START_COLOR, END_COLOR, 0);
        //use currColor but at 50% opacity
        p5.fill(p5.red(currColor), p5.green(currColor), p5.blue(currColor), 125);
        //p5.rect(x, y, TILE_SIZE, TILE_SIZE);
        p5.fill(currColor);
        if(this.state.samples){
          drawNotes(p5, sample.notes, x, y, TILE_SIZE, TILE_SIZE);
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

      let samples_canvas = this.state.samples.map((sample, index) =>{
        return (
         <div key={index}>
            <Sketch setup={(p5) => setup(p5, this)} draw={(p5) => draw(p5, sample)} />
            <button type="button" onClick={(e) => play_sample(sample, e)} >PONÉ PLAY</button>
         </div>
       )
       });

      //let samples_canvas = this.state.samples.map((sample, index) => <Sketch setup={setup} draw={draw} key={index}/>);




      return (
        <div>Nuestros hermanos Estadounidenses, Alemanes y Taiwaneses nos han hecho entrar
         en la era de la tecnología digital a tal punto que lo único que tenés que
         hacer es poner el dedo y apretar un botón...
                 <Async promiseFn={init_model} model={model}>
                   <Async.Pending>Loading...</Async.Pending>
                   <Async.Fulfilled>
                      <button type="button" onClick={generate_samples} >Generate</button>
                   </Async.Fulfilled>
                   <Async.Rejected>{error => `Something went wrong: ${error.message}`}</Async.Rejected>
                 </Async>
                 <div>
                   { samples_canvas }
                 </div>
         </div>

      );
    }
}

// ========================================

ReactDOM.render(
  <PlayTrio />,
  document.getElementById('root')
);
