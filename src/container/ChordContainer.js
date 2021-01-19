import { theory } from "etude";
import React, { Component } from "react";
import { Header, Message, Segment } from "semantic-ui-react";
import ButtonGroup from "../component/ButtonGroup";
import ObjectUtils from "../util/ObjectUtils";
import StringUtils from "../util/StringUtils";

const { Accidental, Chord, Key, Letter, Pitch } = theory;

export default class ChordContainer extends Component {
  constructor(props) {
    super(props);

    this.updateHighlight = this.updateHighlight.bind(this);
    this.handleAccidental = this.handleAccidental.bind(this);
    this.handleInversion = this.handleInversion.bind(this);
    this.handleLetter = this.handleLetter.bind(this);
    this.handleQuality = this.handleQuality.bind(this);

    this.state = {
      accidental: null,
      inversion: null,
      letter: null,
      octave: null,
      quality: null,

      error: false,
    };
  }

  updateHighlight = () => {
    const { accidental, inversion, letter, octave, quality } = this.state;

    if (
      !ObjectUtils.checkAllNotNull(
        accidental,
        inversion,
        letter,
        octave,
        quality
      )
    ) {
      return;
    }

    try {
      const chord = Chord.builder()
        .setRoot(new Pitch(new Key(letter, accidental), octave))
        .add(quality)
        .setInversion(inversion)
        .build();

      this.props.onHighlight(chord.pitches);
      this.setState({
        error: false,
      });
    } catch (e) {
      console.error(e.toString());
      this.props.onHighlight([]);
      this.setState({
        error: true,
      });
    }
  };

  handleAccidental = (accidental) => {
    this.setState({ accidental }, () => this.updateHighlight());
  };

  handleInversion = (inversion) => {
    this.setState({ inversion }, () => this.updateHighlight());
  };

  handleLetter = (letter) => {
    this.setState({ letter }, () => this.updateHighlight());
  };

  handleOctave = (octave) => {
    this.setState({ octave }, () => this.updateHighlight());
  };

  handleQuality = (quality) => {
    this.setState({ quality: Chord.Quality[quality] }, () =>
      this.updateHighlight()
    );
  };

  render = () => {
    return (
      <Segment attached="bottom">
        <Header as="h2" dividing>
          Letter
        </Header>
        <ButtonGroup
          source={Letter.values()}
          onClick={this.handleLetter}
          toString={(l) => l.toString()}
        />
        <Header as="h2" dividing>
          Accidental
        </Header>
        <ButtonGroup
          source={Accidental.values()}
          onClick={this.handleAccidental}
          toString={(a) => `${a.toString()} (${a.getOffset()})`}
        />
        <Header as="h2" dividing>
          Octave
        </Header>
        <ButtonGroup
          source={[1, 2, 3, 4, 5, 6, 7, 8]}
          onClick={this.handleOctave}
          toString={(o) => o}
        />
        <Header as="h2" dividing>
          Quality
        </Header>
        <ButtonGroup
          source={Object.keys(Chord.Quality).slice(0, 8)}
          onClick={this.handleQuality}
          toString={(i) => StringUtils.toCamelCase(i.replace(/_/g, " "))}
        />
        <Header as="h2" dividing>
          Inversion
        </Header>
        <ButtonGroup
          source={Chord.Inversion.values()}
          onClick={this.handleInversion}
          toString={(i) => StringUtils.toCamelCase(i.toString())}
        />
        {this.state.error && (
          <Message error>
            <Message.Header>Invalid input.</Message.Header>
          </Message>
        )}
      </Segment>
    );
  };
}
