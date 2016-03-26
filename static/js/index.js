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

    componentDidMount: function() {
        this.serverRequest = $.get('/voyage', function (result) {
            if ('time_started' in result) {
                this.setState({
                    time_started: result.time_started,
                    button_text: 'Stop',
                })
            }
        }.bind(this));
    },

    handleChange: function(e) {

    },

    render: function() {
        return (
            <button id="start-button">{this.state.button_text}</button>
        )
    }
});

ReactDOM.render(<App/>, document.getElementById('react-app'));
