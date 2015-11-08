/* @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
  getInitialState: function(){
    return {
      meter: 20,
      left: 'null',
      right: 'null',
      timer: 'null',
      handVisible: 'null'
    }
  },
  componentWillMount: function(){
    var state = this.getInitialState();
    this.setState(state);
  },
  render: function() {
    return (
      <div>
        <p>Mouse: </p>
        <table>
          <tbody>
            <tr>
              <td>Left</td>
              <td>{this.state.left}</td>
            </tr>
            <tr>
              <td>Right</td>
              <td>{this.state.right}</td>
            </tr>
          </tbody>
        </table>

        <p>Sensor: </p>
        <table>
          <tbody>
            <tr>
              <th>Elapsed time:</th>
              <td>{this.state.timer}</td>
            </tr>
            <tr>
              <th>Hand visible:</th>
              <td>{this.state.handVisible}</td>
            </tr>
            <tr>
              <th>Hand confidence: </th>
              <td><meter value={this.state.meter} max={100} optimum={90} low={50} min={0} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
});
