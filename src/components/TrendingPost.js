/**
 * =====================================
 * REACT COMPONENT CLASS
 * =====================================
 * @date created: 12 October 2019
 * @authors: Waqas Rehmani
 *
 * This file defines the TrendingPost component. The class TrendingPost
 * is where the component is defined.
 *
 * This is a component defined for reusability.
 *
 * This component shows a post that is seen on the trending page.
 *
 */


// Importing libraries for setup
import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'

class TrendingPost extends Component {
    // Reroutes to display the post in PostDetail page.
    goToPost = () => {
        this.props.history.push('/post/' + this.props.post.postId)
    }

    // Render method for TrendingPost
    render() {
        const {post, span} = this.props;

        return (
            <div
                className='trending-list-item'
                style={span % 8 === 0 ? {
                    gridRow: 'span 2',
                    gridColumn: 'span 2',
                    fontSize: '25px'
                } : {fontSize: '12px'}}
                onClick={this.goToPost}
            >
                {
                    this.props.post.type !== 'text'
                        ?
                        <div className='trending-list-item-image'>
                            <img src={this.props.post.asset} alt="" />
                        </div>

                        :
                        <div/>
                }

                <div
                    className={post.isQuestion ? 'trending-list-item-overlay trending-list-item-overlay-question' : 'trending-list-item-overlay'}/>

                <div className='trending-list-item-text'>
                    {post.description}
                </div>
            </div>
        )
    }
}

export default withRouter(TrendingPost)