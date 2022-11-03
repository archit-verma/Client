import React, { Component } from 'react';
import '../../App.css';
export default class Dropped extends Component {
    state = {
        tasks: [
            { name: "Angular", category: "wip", bgcolor: "yellow" },
            { name: "React", category: "wip", bgcolor: "pink" },
            { name: "Vue", category: "wip", bgcolor: "skyblue" }
        ]
    }
    onDragOver = (ev) => {
        ev.preventDefault();
    }
    onDragStart = (ev, id) => {
        console.log('drag', id);
        ev.dataTransfer.setData('id', id);
    }
    onDrop = (ev, cat) => {
        let id = ev.dataTransfer.getData('id');
        let taskarr = [];
        let tasks = this.state.tasks.filter((task) => {
            console.log('id '+id);
			console.log('title '+task.name); 
            if (task.name == id) {
               // taskarr = { "name": task.name, "category": "wip", "bgcolor":task.bgcolor};
                // this.state.tasks.push(taskarr)
                task.category = cat;

            }

            return task;
        });
        this.setState({
            ...this.state,
        });
        //this.state.tasks.push(taskarr)
    }
    render() {
        var tasks = {
            wip: [],
            complete: [],
        }
        this.state.tasks.forEach((t) => {

            tasks[t.category].push(
                <div key={t.name} onDragStart={(e) => this.onDragStart(e, t.name)} draggable className="draggable" style={{ backgroundColor: t.bgcolor }}>
                    {t.name}
                </div>
            );
        });
        return (
            <div className='contain-drag'>
                <h2 className='header'> Drag and Drop demo</h2>
                <div className='wip'
                onDragOver={(e) => this.onDragOver(e)}
                onDrop={(e) => this.onDrop(e, 'wip')}
                >
                    <span className='task-header'>Wip</span>
                    {tasks.wip}

                </div>
                <div className="droppable"
                    onDragOver={(e) => this.onDragOver(e)}
                    onDrop={(e) => this.onDrop(e, 'complete')}

                >
                    <span className='task-header'>Completed</span>
                    {tasks.complete}
                </div>


            </div>
        )
    }

}
