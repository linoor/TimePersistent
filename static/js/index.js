var ReactDOM = require('react-dom');
var React = require('react');
window.jQuery = window.$ = require('jquery');
var bootstrap = require('bootstrap');

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
            elapsed: 0,
            from_place: 'home',
            to_place: 'work',
            type: 'car',
            note: ''
        }
    },

    componentDidMount: function() {
        this.serverRequest = $.get('/voyage', function (result) {
            if ('time_started' in result) {
                var time_started = Date.parse(result.time_started);
                this.setState({
                    time_started: time_started,
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

    handleClick: function(event) {
    },

    render: function() {
        var delta = this.state.elapsed / 1000;

        var minutes = Math.floor(delta / 60);
        var seconds = (delta % 60).toFixed(0);

        var button_text = this.state.elapsed == 0 ? 'Start' : 'Stop';

        return (
            <div>
                <p>{minutes}min{seconds}s</p>
                <div id="inputs">
                    <div className="input-group">
                        <span className="input-group-addon" id="basic-addon1">Start</span>
                        <input type="text" className="form-control"
                               value={this.state.from_place}
                               placeholder="Home, work etc." aria-describedby="basic-addon1"/>
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon" id="basic-addon1">Destination</span>
                        <input type="text" className="form-control"
                               value={this.state.to_place}
                               placeholder="Home, work etc." aria-describedby="basic-addon1"/>
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon" id="basic-addon1">Type</span>
                        <input type="text" className="form-control"
                               value={this.state.type}
                               placeholder="Car, Mpk etc." aria-describedby="basic-addon1"/>
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon" id="basic-addon1">Notes</span>
                        <input type="text" className="form-control"
                               value={this.state.note}
                               placeholder="Problems on the way etc. (in JSON)" aria-describedby="basic-addon1"/>
                    </div>
                    <button type="button" className="btn btn-default"
                            id="start-button" onclick={this.handleClick}>{button_text}</button>
                </div>
            </div>
        )
    }
});

ReactDOM.render(<App/>, document.getElementById('react-app'));
