import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as mm from '@magenta/music';
import Async from "react-async"
import { useAsync } from "react-async"

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

class PlayButton extends React.Component {
  render(){
    let model = this.props.model;
    let player = this.props.player;
    //const state = useAsync({ promiseFn: this.props.model.initialize })

    // this.props.model
    //   .initialize()
    //   .then(() => this.props.model.sample(1))
    //   .then(samples => {
    //     this.props.player.resumeContext();
    //     this.props.player.start(samples[0])
    //   });

      return (
        "o"
      )
  }
}




class PlayTrio extends React.Component {

    render() {
      const model = new mm.MusicVAE( 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/trio_4bar');
      const player = new mm.Player();

      const init_model = async ({model}) => {
        return await model.initialize();
      }

      let samples;

      const generate_samples = async() =>{
        samples = await model.sample(1);
      }

      const play = async () => {
        if(samples) {
            player.resumeContext();
            player.start(samples[0])
          };
      }


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
         </div>

      );
    }
}

// ========================================

ReactDOM.render(
  <PlayTrio />,
  document.getElementById('root')
);
