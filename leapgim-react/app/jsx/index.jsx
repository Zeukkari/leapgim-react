/* @jsx React.DOM */

var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require('react-tap-event-plugin');

if (typeof window !== 'undefined') {
    window.React = React;
}

injectTapEventPlugin();

var Main = require('./components/Main.jsx');
var main = ReactDOM.render(<Main />, document.getElementById('content'));
window.viewModel = main.getInitialState()
window.main = main
