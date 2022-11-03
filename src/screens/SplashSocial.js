import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';

class SplashSocial extends Component {
    constructor(props) {
		super(props);
		
		this.state = {
			redirect: false
		}
	}
    
    componentDidMount() {
        this.id = setTimeout(() => this.setState({ redirect: true }), 3000)
    }
    
    componentWillUnmount() {
        clearTimeout(this.id)
    }

    render() {
        return (
            this.state.redirect ? <Redirect to='/home' /> : 
            <div class='outbx'>
                <div class="splsh displayoff">
                    <div class="splshin-logo"><img src="/uploads/images/logo-social.png"/></div>
                    <div class="text-center wbtxt">www.coachly.com</div>
                    <div class="splshin"><img src="/uploads/images/splash-social.jpg"/></div> 
                </div>

                <div class="splsh2">
                    <div class="splshin-logo"><img src="/uploads/images/logo-planner.png"/></div>
                    <div class="text-center wbtxt">www.coachly.com</div>
                    <div class="splshin"><img src="/uploads/images/splash-planner.jpg"/></div> 
                </div>
            </div>
        )
    }
}

export default SplashSocial;