import React, { Component } from 'react';
import Draggable from 'react-draggable';

class PlannerBarPrograms extends Component {
	constructor(props){
		super(props);
	}
	
	render(){
		return(
			<Draggable axis="x" grid={[21, 92]} position={this.props.position} onDrag={this.props.onDrag} cancel={".program-drag"}><div className="weeks-container">{this.props.weekbarHtml}</div></Draggable>
		);
	}
}

export default PlannerBarPrograms;