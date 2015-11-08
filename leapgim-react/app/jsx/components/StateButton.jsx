var React = require('react');

module.exports = React.createClass({
	getInitialState: function(){
		return {
     		defaultMsg: "foobar",
     		msg: ""
     	}
  	},
  	componentWillMount: function(){
  		this.setState({
  			defaultMsg: "goobar",
  			msg: "boo"
  		});
  	},
  	render: function() {
    	return (
      	<div id='left'>
        	{this.state.msg}
      	</div>
    	);
  	},
  	setValue: function(msg) {
  		this.setState({
  			defaultMsg: "goobar",
  			msg: msg
  		})
  	}
});
