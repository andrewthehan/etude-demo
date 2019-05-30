
import React, { Component } from 'react';

import { Header, Message, Segment } from 'semantic-ui-react';

import ButtonGroup from '../component/ButtonGroup';
import ObjectUtils from '../util/ObjectUtils';
import StringUtils from '../util/StringUtils';

import { theory } from 'etude';
const { Accidental, Interval, Key, Letter, Pitch } = theory;

export default class IntervalContainer extends Component {
  constructor(props) {
    super(props);

    this.updateHighlight = this.updateHighlight.bind(this);
    this.handleAccidental = this.handleAccidental.bind(this);
    this.handleDistance = this.handleDistance.bind(this);
    this.handleLetter = this.handleLetter.bind(this);
    this.handleOctave = this.handleOctave.bind(this);
    this.handleQuality = this.handleQuality.bind(this);

    this.state = {
      accidental: null,
      distance: null,
      letter: null,
      octave: null,
      quality: null,

      error: false
    };
  }

  updateHighlight = () => {
    const { accidental, distance, letter, octave, quality } = this.state;

    if(!ObjectUtils.checkAllNotNull(accidental, distance, letter, octave, quality)){
      return;
    }

    try{
      const pitch = new Pitch(new Key(letter, accidental), octave);
      const interval = new Interval(quality, distance);

      const otherPitch = pitch.step(interval).get();
      
      this.props.onHighlight([pitch, otherPitch]);
      this.setState({
        error: false
      });
    }
    catch(e){
      console.error(e.toString());
      this.props.onHighlight([]);
      this.setState({
        error: true
      });
    }
  }

  handleAccidental = (accidental) => {
    this.setState({ accidental }, () => this.updateHighlight());
  }

  handleDistance = (distance) => {
    this.setState({ distance }, () => this.updateHighlight());
  }

  handleLetter = (letter) => {
    this.setState({ letter }, () => this.updateHighlight());
  }

  handleOctave = (octave) => {
    this.setState({ octave }, () => this.updateHighlight());
  }

  handleQuality = (quality) => {
    this.setState({ quality }, () => this.updateHighlight());
  }

  render = () => {
    return (
      <Segment attached='bottom'>
        <Header as='h2' dividing>Letter</Header>
        <ButtonGroup source={Letter.values()} onClick={this.handleLetter} toString={l => l.toString()} />
        <Header as='h2' dividing>Accidental</Header>
        <ButtonGroup source={Accidental.values()} onClick={this.handleAccidental} toString={a => `${a.toString()} (${a.getOffset()})`} />
        <Header as='h2' dividing>Octave</Header>
        <ButtonGroup source={[1, 2, 3, 4, 5, 6, 7, 8]} onClick={this.handleOctave} toString={o => o} />
        <Header as='h2' dividing>Quality</Header>
        <ButtonGroup source={Interval.Quality.values()} onClick={this.handleQuality} toString={q => q.toString()} />
        <Header as='h2' dividing>Distance</Header>
        <ButtonGroup source={[2, 3, 4, 5, 6, 7, 8]} onClick={this.handleDistance} toString={d => d} />
        {
          this.state.error && <Message error><Message.Header>Invalid input.</Message.Header></Message>
        }
      </Segment>
    );
  }
}
