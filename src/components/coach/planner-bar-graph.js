import React, { Component } from 'react';
import Draggable from 'react-draggable';

class PlannerBarGraph extends Component {
	constructor(props){
		super(props);
	}
	
	render(){
		return(
			<Draggable axis="x" grid={[21, 92]} position={this.props.position} onDrag={this.props.onDrag}>
				<div>
					<div className="graph-view-container">
						{this.props.displayPlannerGraph}
					</div>
					<div className="weeks-container">{this.props.graphWeekbarHtml}</div>
				</div>
			</Draggable>
		);
	}
}

export default PlannerBarGraph;