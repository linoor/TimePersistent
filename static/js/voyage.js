var ReactDOM = require('react-dom');
var React = require('react');
window.jQuery = window.$ = require('jquery');
var bootstrap = require('bootstrap');

var Voyage = React.createClass({
    getInitialState: function () {
        var slug = window.location.href.split('/');
        return {
            id: slug[slug.length-1],
            time_ended: 0,
            time_started: 0,
            duration: 0
        }
    },

    handleClick: function(url, dur) {
        self = this;
        return function(event) {
            $.post('/api/voyage/'+self.state.id+'/'+url, function(result) {
                self.setState({
                    duration: self.state.duration + dur
                })
            })
        }
    },

    render: function() {
        var minutes = (this.state.duration / 60).toFixed(0);
        var seconds = this.state.duration % 60;

        minutes = ("0" + minutes).slice(-2);
        seconds = ("0" + seconds).slice(-2);

        return (
            <div>
                <div className="row">
                    <div className="col-xs-12 text-center">
                        <h1 className="voyage-title">Voyage {this.state.id}</h1>
                    </div>
                </div>
                <div id="time-modify" className="row">
                    <div className="col-xs-3 col-md-offset-1">
                        <button type="button" className="btn btn-default" onClick={this.handleClick('decrease-time', -60)}>
                            <span className="glyphicon glyphicon-minus"></span>
                        </button>
                    </div>
                    <div className="col-xs-6 text-center col-md-4">
                        <span className="min">{minutes}</span><span>m</span>
                        <span className="sec">{seconds}</span><span>s</span>
                    </div>
                    <div className="col-xs-3 text-center">
                        <button type="button" className="btn btn-default" onClick={this.handleClick('add-time', 60)}>
                            <span className="glyphicon glyphicon-plus"></span>
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-offset-1 col-xs-5 text-center">
                        <h2 className="voyage-place">{this.state.from_place}</h2>
                    </div>
                    <div className="col-xs-5 text-center">
                        <h2 className="voyage-place">{this.state.to_place}</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 text-center">
                        <h2 className="voyage-date">{this.state.time_started}</h2>
                    </div>
                    <div className="col-md-6 text-center">
                        <h2 className="voyage-date">{this.state.time_ended}</h2>
                    </div>
                </div>
            </div>
        )
    },

    componentDidMount: function (api) {
        self = this;
        $.get('/api/voyage/'+this.state.id, function (result) {
            var time_started = result.time_started === null ? 0 : (result.time_started);
            var time_ended = result.time_ended === null ? 0 : (result.time_ended);

            self.setState({
                time_started: time_started,
                duration: result.duration,
                time_ended: time_ended,
                from_place: result.from_place,
                to_place: result.to_place,
                type: result.type
            });
        });
    }
});

ReactDOM.render(<Voyage/>, document.getElementById('voyage-react'));
