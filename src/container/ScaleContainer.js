import { theory } from "etude";
import React, { Component } from "react";
import { Header, Message, Segment } from "semantic-ui-react";
import ButtonGroup from "../component/ButtonGroup";
import ObjectUtils from "../util/ObjectUtils";
import StringUtils from "../util/StringUtils";

const { Accidental, Direction, Key, Letter, Pitch, Scale } = theory;

export default class ChordContainer extends Component {
  constructor(props) {
    super(props);

    this.updateHighlight = this.updateHighlight.bind(this);
    this.handleAccidental = this.handleAccidental.bind(this);
    this.handleCount = this.handleCount.bind(this);
    this.handleDirection = this.handleDirection.bind(this);
    this.handleLetter = this.handleLetter.bind(this);
    this.handleQuality = this.handleQuality.bind(this);
    this.handleDirection = this.handleDirection.bind(this);

    this.state = {
      accidental: null,
      count: null,
      direction: null,
      letter: null,
      octave: null,
      quality: null,

      error: false,
    };
  }

  updateHighlight = () => {
    const {
      accidental,
      count,
      direction,
      letter,
      octave,
      quality,
    } = this.state;

    if (
      !ObjectUtils.checkAllNotNull(
        accidental,
        count,
        direction,
        letter,
        octave,
        quality
      )
    ) {
      return;
    }

    try {
      const scale = new Scale(
        new Pitch(new Key(letter, accidental), octave),
        quality
      );

      this.props.onHighlight(scale.stream(direction).limit(count));
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

  handleLetter = (letter) => {
    this.setState({ letter }, () => this.updateHighlight());
  };

  handleOctave = (octave) => {
    this.setState({ octave }, () => this.updateHighlight());
  };

  handleQuality = (quality) => {
    this.setState({ quality: Scale.Quality[quality] }, () =>
      this.updateHighlight()
    );
  };

  handleDirection = (direction) => {
    this.setState({ direction }, () => this.updateHighlight());
  };

  handleCount = (count) => {
    this.setState({ count }, () => this.updateHighlight());
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
          source={Object.keys(Scale.Quality).slice(0, 8)}
          onClick={this.handleQuality}
          toString={(i) => StringUtils.toCamelCase(i.replace(/_/g, " "))}
        />
        <Header as="h2" dividing>
          Direction
        </Header>
        <ButtonGroup
          source={Direction.values()}
          onClick={this.handleDirection}
          toString={(i) => StringUtils.toCamelCase(i.toString())}
        />
        <Header as="h2" dividing>
          Count
        </Header>
        <ButtonGroup
          source={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
          onClick={this.handleCount}
          toString={(c) => c}
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
