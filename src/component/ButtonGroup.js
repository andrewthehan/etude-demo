
import React, { Component } from 'react';

import { Button } from 'semantic-ui-react';

export default class ButtonGroup extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      active: -1
    };
  }

  handleClick = (element, i) => {
    this.setState({ active: i });
    this.props.onClick(element);
  }

  render = () => {
    return (
      <Button.Group compact fluid>
        {this.props.source.map((element, i) => 
          <Button key={i} basic={i !== this.state.active} color='black' active={i === this.state.active} onClick={(e, d) => this.handleClick(element, i)}>{this.props.toString(element)}</Button>
        )}
      </Button.Group>
    );
  }
}