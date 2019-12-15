import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as mm from '@magenta/music';
import Async from "react-async"
import Sketch from 'react-p5'

class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {/* TODO */}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}




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

      let x = 50
      let y = 50

      const setup = (p5, canvasParentRef) => {
        p5.createCanvas(500, 100).parent(canvasParentRef)
      }

      const draw = p5 => {
        p5.background(0)
        p5.ellipse(x, y, 10, 10)
        // NOTE: Do not use setState in draw function or in functions that is executed in draw function... pls use normal variables or class properties for this purposes
        x++
      }

      let samples_canvas = this.state.samples.map((sample, index) => <Sketch setup={setup} draw={draw} key={index}/>);


      return (
        <div>Nuestros hermanos Estadounidenses, Alemanes y Taiwaneses nos han hecho entrar
         en la era de la tecnología digital a tal punto que lo único que tenés que
         hacer es poner el dedo y apretar un botón...
                 <Async promiseFn={init_model} model={model}>
                   <Async.Pending>Loading...</Async.Pending>
                   <Async.Fulfilled>
                      <button type="button" onClick={generate_samples} >Generate</button>
                      <button type="button" onClick={play} >PONÉ PLAY</button>
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
