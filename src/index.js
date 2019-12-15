import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as mm from '@magenta/music';
import Async from "react-async"
import PianoRoll from "./PianoRoll"


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


      let samples_canvas = this.state.samples.map((sample, index) =>{
        let notesByInstrument = {}
        sample.notes.map((note) => {
          if(!(note.instrument in notesByInstrument))
            notesByInstrument[note.instrument] = []
          notesByInstrument[note.instrument].push(note)
        })
        return (
         <div key={index}>
            <PianoRoll notes={notesByInstrument[0]} />
            <PianoRoll notes={notesByInstrument[1]} />
            <PianoRoll notes={notesByInstrument[2]} />
            <button type="button" onClick={(e) => play_sample(sample, e)} >PONÉ PLAY</button>
         </div>
       )
       });

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
