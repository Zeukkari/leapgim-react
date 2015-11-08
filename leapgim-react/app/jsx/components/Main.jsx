/* @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <title>Leapgim</title>
        <h1 style={{textAlign: 'center'}}>Leapgim</h1>
        <table style={{padding: 3, borderSpacing: 3}}>
          <colgroup>
            <col style={{width: 150}} />
            <col style={{width: '50x'}} />
          </colgroup>
          <tbody>
            <tr>
              <th>Hand confidence: </th>
              <td style={{textIndent: 20}} colSpan={2}><meter value={0} max={100} optimum={90} low={50} min={0} id="meter" />{this.props.viewModel.meter}</td>
            </tr>
            <tr>
              <td style={{padding: 15}} colSpan={3} />
            </tr>
            <tr>
              <th style={{textAlign: 'center'}} rowSpan={2}>Mouse: </th>
              <td style={{textIndent: 20}}>Left</td>
              <td><div id="left" className="stat">{this.props.viewModel.left}</div></td> </tr>
            <tr>
              <td style={{textIndent: 20}}>Right</td>
              <td><div id="right" className="stat">{this.props.viewModel.right}</div></td>
            </tr>
            <tr>
              <td style={{padding: 15}} colSpan={3} />
            </tr>
            <tr>
              <th style={{textAlign: 'center'}}>Elapsed time:</th>
              <td style={{textIndent: 20}} colSpan={2}><div id="timer" className="stat">{this.props.viewModel.timer}</div></td>
            </tr>
            <tr>
              <th style={{textAlign: 'center'}}>Hand visible:</th>
              <td style={{textIndent: 20}} colSpan={2}><div id="handVisible" className="stat">{this.props.viewModel.handVisible}</div></td>
            </tr>
          </tbody></table>
        &lt;
      </div>
    );
  }
});
