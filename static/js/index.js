var ReactDOM = require('react-dom');
var React = require('react');

module.exports = React.createClass({
   render: function(){
       return <h1>Hello, world.</h1>
   }
});

ReactDOM.render(<App/>, document.getElementById('react-app'))
