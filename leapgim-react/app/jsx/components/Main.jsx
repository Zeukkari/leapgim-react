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
        <table style={{padding: 3, borderSpacing: 3}}>
          <colgroup>
            <col style={{width: 150}} />
            <col style={{width: 50}} />
          </colgroup>
          <tbody>
            <tr>
              <th>Hand confidence: </th>
              <td style={{textIndent: 20}} colSpan={2}><meter value={this.state.meter} max={100} optimum={90} low={50} min={0} id="meter" /></td>
            </tr>
            <tr>
              <td style={{padding: 15}} colSpan={3} />
            </tr>
            <tr>
              <th style={{textAlign: 'center'}} rowSpan={2}>Mouse: </th>
              <td style={{textIndent: 20}}>Left</td>
              <td><div id="left" className="stat">{this.state.left}</div></td> </tr>
            <tr>
              <td style={{textIndent: 20}}>Right</td>
              <td><div id="right" className="stat">{this.state.right}</div></td>
            </tr>
            <tr>
              <td style={{padding: 15}} colSpan={3} />
            </tr>
            <tr>
              <th style={{textAlign: 'center'}}>Elapsed time:</th>
              <td style={{textIndent: 20}} colSpan={2}><div id="timer" className="stat">{this.state.timer}</div></td>
            </tr>
            <tr>
              <th style={{textAlign: 'center'}}>Hand visible:</th>
              <td style={{textIndent: 20}} colSpan={2}><div id="handVisible" className="stat">{this.state.handVisible}</div></td>
            </tr>
          </tbody></table>
      </div>
    );
  }
});
