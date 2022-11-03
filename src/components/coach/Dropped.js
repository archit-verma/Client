import React, { Component } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag, generateItems } from './utils';

const groupStyle = {
  marginLeft: '50px',
  flex: 1
}

export default class Dropped extends Component {
  constructor() {
    super();

    this.state = {
      items1: generateItems(3, (i) => ({ id: '1' + i, data: `Item  - ${i}` })),
      items2: [],
      // items3: generateItems(3, (i) => ({ id: '3' + i, data: `Draggable 3 - ${i}` })),
      // items4: generateItems(3, (i) => ({ id: '4' + i, data: `Draggable 4 - ${i}` })),
    }
  }
  render() {
    console.log(this.state.items2);
    return (
      <div style={{ display: 'flex', justifyContent: 'stretch', marginTop: '50px', marginRight: '50px' }}>
        <div style={groupStyle}>
          <Container groupName="1" behaviour="copy" getChildPayload={i => this.state.items1[i]} onDrop={e => this.setState({ items1: applyDrag(this.state.items1, e) })}>
            {
              this.state.items1.map((p,i) => {
                return (
                  <Draggable key={i}>
                    <div className="draggable-item">
                      {p.data}
                    </div>
                  </Draggable>
                );
              })
            }
          </Container>
        </div>
        <div style={groupStyle}>
          <Container groupName="1" getChildPayload={i => this.state.items2[i]} onDrop={e => this.setState({ items2: applyDrag(this.state.items2, e) })}>
            {
              this.state.items2.map((p, i) => {
                return (
                  <Draggable key={i}>
                    <div className="draggable-item">
                      {p.data}
                    </div>
                  </Draggable>
                );
              })
            }
          </Container>
        </div>        
          
      </div>
    );
  }
}
