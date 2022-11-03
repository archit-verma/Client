import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {configure, mount, shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('api test case - getUser returns correct user', () => {
  const wrapper = mount(<App />);
  return (
      wrapper.instance().loginUser({
        userId: 'jparikh',
        password: 'xyz',
      }).then(() => {
        expect(wrapper.state('user').userId).toBe('jparikh');
      })
  )
})

it('api test case - getAllPost > 0', () => {
  const wrapper = mount(<App />);
  return (
      wrapper.instance().componentDidMount().then(() => {
        expect(wrapper.state('posts').length).toBeGreaterThan(0);
      })
  )
})

it('api test case - check if user is stored in db after signing up', () => {
  let r = Math.random().toString(36).substring(7);
  console.log("random", r);
  const wrapper = mount(<App />);
  return (
      wrapper.instance().signUpUser({
        userId: r,
        firstName: 'Yash',
        lastName: 'sdfsdf',
        email: r,
        password: 'xyzzy',
        role: 'Athlete',
        dob: '1998-08-10',
        phone: '046453645'
      }).then(res => {
        expect(res).toBe(true);
      })
  )
})