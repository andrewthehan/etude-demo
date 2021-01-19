import { Piano as TonePiano } from "@tonejs/piano";
import React, { Component } from "react";
import Piano from "react-piano";
import {
  Container,
  Grid,
  Icon,
  Menu,
  Message,
  Segment,
} from "semantic-ui-react";
import ChordContainer from "./ChordContainer";
import IntervalContainer from "./IntervalContainer";
import ScaleContainer from "./ScaleContainer";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.handleHighlight = this.handleHighlight.bind(this);
    this.renderContainer = this.renderContainer.bind(this);

    this.state = {
      active: "Chord",
      highlight: [],
      piano: null,
      loading: false,
    };
  }

  // const midi = require("./clair_de_lune.json");
  // console.log(midi);
  // Tone.Transport.bpm.value = midi.header.bpm;
  // Tone.Transport.timeSignature = midi.timeSignature;
  // const notes = midi.tracks.reduce((a, x) => a.concat(x.notes), []);
  // const notesOn = notes;
  // const notesOff = notes
  //   .map(({ name, midi, time, velocity, duration }) => ({
  //     name,
  //     midi,
  //     time: time + duration,
  //     velocity,
  //     duration: 0,
  //   }))
  //   .sort((a, b) => a.time - b.time);
  // new Tone.Part((time, event) => {
  //   // console.log("down", time, event);
  //   piano.keyUp(event.midi, time + 0.8);
  //   piano.keyDown(event.midi, time + 1, event.velocity);
  //   // this.handleHighlight([...this.state.highlight, theory.Pitch.fromProgramNumber(event.midi).get()]);
  // }, notesOn).start();
  // new Tone.Part((time, event) => {
  //   // console.log("up", time, event);
  //   piano.keyUp(event.midi, time + 1);
  //   // console.log(this.state.highlight.map(h => h.getProgramNumber()), event.midi);
  //   // this.handleHighlight(this.state.highlight.filter(h => h.getProgramNumber() !== event.midi));
  // }, notesOff).start();
  // new Tone.Part((time, event) => {
  //   if (event.value) {
  //     piano.pedalDown(time + 1);
  //   } else {
  //     piano.pedalUp(time + 1);
  //   }
  // }, midi.tracks[0].controlChanges[64]).start();

  loadPiano = () => {
    this.setState({ loading: true });
    const piano = new TonePiano({ velocities: 5 });
    piano.toDestination();
    piano.load().then(() => {
      this.setState({ piano, loading: false });
    });
  };

  handleMenu = (e, { name }) => {
    if (this.state.active === name) {
      return;
    }

    this.setState({ active: name, highlight: [] });
  };

  pitchesDown = (pitches) => {
    const { piano } = this.state;
    pitches.forEach((p) => piano.keyDown({ note: p.getKey() + p.getOctave() }));
  };

  pitchesUp = (pitches) => {
    const { piano } = this.state;
    pitches.forEach((p) => piano.keyUp({ note: p.getKey() + p.getOctave() }));
  };

  play = async (previousHighlight, currentHighlight) => {
    this.pitchesUp(previousHighlight);
    this.pitchesDown(currentHighlight);
  };

  handleHighlight = (currentHighlight) => {
    const { highlight } = this.state;
    this.setState({ highlight: currentHighlight }, () => {
      this.play(highlight, currentHighlight);
    });
  };

  renderContainer = () => {
    const { active } = this.state;

    switch (active) {
      case "Interval":
        return <IntervalContainer onHighlight={this.handleHighlight} />;
      case "Chord":
        return <ChordContainer onHighlight={this.handleHighlight} />;
      case "Scale":
        return <ScaleContainer onHighlight={this.handleHighlight} />;
      case "Piano":
        return (
          <Segment attached="bottom">
            <code>
              const scale = new Scale(startPitch, Scale.Quality.CHROMATIC);
            </code>
          </Segment>
        );
      default:
        return null;
    }
  };

  render = () => {
    const { active, highlight, piano, loading } = this.state;

    return (
      <div>
        <Menu fixed="top" inverted>
          <Container>
            <Menu.Item header name="etude demo" />
          </Container>
        </Menu>
        <Grid verticalAlign="top">
          <Grid.Row centered>
            <Piano
              start={"A1"}
              end={"C8"}
              keyPressed={(p) => {
                if (piano != null)
                  piano.keyDown({ note: p.getKey() + p.getOctave() });
              }}
              keyReleased={(p) => {
                if (piano != null)
                  piano.keyUp({ note: p.getKey() + p.getOctave() });
              }}
              highlight={highlight}
              showLabel
            />
          </Grid.Row>
          <Grid.Row>
            <Container>
              {piano == null && !loading && (
                <button onClick={this.loadPiano}>Load piano sounds</button>
              )}
              {piano == null && loading && (
                <Message icon info>
                  <Icon name="circle notched" loading />
                  <Message.Content>
                    <Message.Header>Loading piano sounds...</Message.Header>
                  </Message.Content>
                </Message>
              )}
              <Menu attached="top" tabular>
                <Menu.Item
                  header
                  name="Piano"
                  active={active === "Piano"}
                  onClick={this.handleMenu}
                />
                <Menu.Item
                  name="Interval"
                  active={active === "Interval"}
                  onClick={this.handleMenu}
                />
                <Menu.Item
                  name="Chord"
                  active={active === "Chord"}
                  onClick={this.handleMenu}
                />
                <Menu.Item
                  name="Scale"
                  active={active === "Scale"}
                  onClick={this.handleMenu}
                />
              </Menu>
              {this.renderContainer()}
            </Container>
          </Grid.Row>
        </Grid>
      </div>
    );
  };
}
