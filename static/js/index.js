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
            button_text: 'Start',
            elapsed: 0
        }
    },

    componentDidMount: function() {
        this.serverRequest = $.get('/voyage', function (result) {
            if ('time_started' in result) {
                var time_started = Date.parse(result.time_started);
                this.setState({
                    time_started: time_started,
                    button_text: 'Stop'
                })
            }
        }.bind(this));

        this.timer = setInterval(this.tick, 50);
    },

    componentWillUnmount: function() {
        clearInterval(this.timer);
    },

    tick: function() {
        this.setState({
            elapsed: Math.abs(new Date() - this.state.time_started)
        });
    },

    render: function() {
        var delta = this.state.elapsed / 1000;

        var minutes = Math.floor(delta / 60);
        var seconds = (delta % 60).toFixed(0);

        return (
            <div>
                <p>{minutes}min{seconds}s</p>
                <button id="start-button">{this.state.button_text}</button>
            </div>
        )
    }
});

ReactDOM.render(<App/>, document.getElementById('react-app'));
