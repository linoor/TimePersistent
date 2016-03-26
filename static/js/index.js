var ReactDOM = require('react-dom');
var React = require('react');
var $ = require('jquery');

var App = React.createClass({
   render: function(){
       return (
           <div>
               <Starter />
           </div>
       )
   }
});

var Starter = React.createClass({
    getInitialState: function() {
        return {
            button_text: 'Start'
        }
    },

    render: function() {
        return (
            <button id="start-button">{this.state.button_text}</button>
        )
    }
});

ReactDOM.render(<App/>, document.getElementById('react-app'));
