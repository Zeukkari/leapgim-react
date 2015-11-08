/* @jsx React.DOM */

var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require('react-tap-event-plugin');

if (typeof window !== 'undefined') {
    window.React = React;
}

injectTapEventPlugin();

//var HelloWorld = require('./components/HelloWorld.jsx');
//React.render(<HelloWorld />, document.getElementById('content'));

//var StateButton = require('./components/StateButton.jsx');
//var stateButton = ReactDOM.render(<StateButton />, document.getElementById('content'));
//console.log("StateButton: ", StateButton);
//window.stateButton = stateButton

var viewModel = {
	meter: 20,
	left: 'null',
	right: 'null',
	timer: 'null',
	handVisible: 'null'
}

var Main = require('./components/Main.jsx');
var main = ReactDOM.render(<Main />, document.getElementById('content'));
window.viewModel = viewModel
window.main = main
