var ReactDOM = require('react-dom');
var React = require('react');
window.jQuery = window.$ = require('jquery');
var bootstrap = require('bootstrap');

var App = React.createClass({
    render: function () {
        return (
            <div>
                <Starter />
            </div>
        )
    }
});

var Starter = React.createClass({
    getInitialState: function () {
        return {
            elapsed: 0,
            from_place: 'home',
            to_place: 'work',
            type: 'car',
            note: '',
            error: '',
            time_started: 0
        }
    },

    componentDidMount: function () {
        this.serverRequest = $.get('/voyage', function (result) {
            if ('time_started' in result) {
                var time_started = Date.parse(result.time_started);
                this.setState({
                    time_started: time_started
                })
            }
        }.bind(this));

        this.timer = setInterval(this.tick, 50);
    },

    componentWillUnmount: function () {
        clearInterval(this.timer);
    },

    tick: function () {
        if (this.state.time_started != 0) {
            this.setState({
                elapsed: Math.abs(new Date() - this.state.time_started)
            });
        } else {
            this.state.elapsed = 0;
        }
    },

    handleClick: function (event) {
        var self = this;
        if (this.state.time_started != 0) {
            $.post('/stop_voyage', function (result) {
                self.setState({
                    time_started: 0
                })
            }).fail(function (result) {
                self.setState({
                    error: result
                })
            })
        } else {
            $.post('/start_voyage', data = {
                from_place: this.state.from_place,
                to_place: this.state.to_place,
                type: this.state.type,
                note: this.state.note
            }, function (result) {
                self.setState({
                    time_started: new Date()
                })
            })
        }
    },

    handleChange: function (key) {
        return function (e) {
            var state = {};
            state[key] = e.target.value;
            this.setState(state);
        }.bind(this);
    },

    render: function () {
        var delta = this.state.elapsed / 1000;

        var minutes, seconds;
        if (this.state.time_started != 0) {
            minutes = Math.floor(delta / 60);
            seconds = (delta % 60).toFixed(0);
        } else {
            minutes = 0;
            seconds = 0;
        }

        minutes = ("0" + minutes).slice(-2);
        seconds = ("0" + seconds).slice(-2);

        var button_text = this.state.time_started == 0 ? 'Start' : 'Stop';

        return (
            <div id="outer">
                <div className="row">
                    <div className="col-lg-4 col-lg-offset-4">
                        <div className="col-lg-6 col-lg-offset-3">
                            <span id="timer"><span id="min">{minutes}</span>m<span id="sec">{seconds}</span>s</span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4 col-lg-offset-4">
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Start</span>
                            <input type="text" className="form-control"
                                   value={this.state.from_place}
                                   onChange={this.handleChange('from_place')}
                                   placeholder="Home, work etc." aria-describedby="basic-addon1"/>
                        </div>
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Destination</span>
                            <input type="text" className="form-control"
                                   value={this.state.to_place}
                                   onChange={this.handleChange('to_place')}
                                   placeholder="Home, work etc." aria-describedby="basic-addon1"/>
                        </div>
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Type</span>
                            <input type="text" className="form-control"
                                   value={this.state.type}
                                   onChange={this.handleChange('type')}
                                   placeholder="Car, Mpk etc." aria-describedby="basic-addon1"/>
                        </div>
                        <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1">Notes</span>
                            <input type="text" className="form-control"
                                   onChange={this.handleChange('note')}
                                   placeholder="Problems on the way etc. (in JSON)" aria-describedby="basic-addon1"/>
                        </div>
                        <div className="col-lg-4 col-lg-offset-4">
                            <button type="button" className="btn btn-default"
                                    id="start-button" onClick={this.handleClick}>{button_text}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

ReactDOM.render(<App/>, document.getElementById('react-app'));
