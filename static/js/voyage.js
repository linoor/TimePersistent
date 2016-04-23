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
            time_started: 0
        }
    },

    render: function() {
        var minutes, seconds, elapsed;
        if (this.state.time_ended != 0) {
           elapsed = Math.abs(this.state.time_ended - this.state.time_started);
        } else {
            elapsed = Math.abs(new Date() - this.state.time_started);
        }
        var delta = elapsed / 1000;
        minutes = Math.floor(delta / 60);
        seconds = (delta % 60).toFixed(0);
        minutes = ("0" + minutes).slice(-2);
        seconds = ("0" + seconds).slice(-2);

        var parseDate = function(date, def_val) {
            if (date != 0) {
                var result = new Date(0);
                result.setUTCMilliseconds(date);
                return result.toString();
            } else {
                return def_val;
            }
        };

        var date_started = parseDate(this.state.time_started, 'not started');
        var date_ended = parseDate(this.state.time_ended, 'not ended');

        return (
            <div>
                <div className="row">
                    <div className="col-xs-12 text-center">
                        <h1 className="voyage-title">Voyage {this.state.id}</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 text-center">
                        <span className="min">{minutes}</span><span>m</span>
                        <span className="sec">{seconds}</span><span>s</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-3 col-xs-offset-3 text-center">
                        <h2 className="voyage-place">{this.state.from_place}</h2>
                    </div>
                    <div className="col-xs-3 text-center">
                        <h2 className="voyage-place">{this.state.to_place}</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 text-center">
                        <h2 className="voyage-date">{date_started}</h2>
                    </div>
                    <div className="col-md-6 text-center">
                        <h2 className="voyage-date">{date_ended}</h2>
                    </div>
                </div>
            </div>
        )
    },

    componentDidMount: function (api) {
        self = this;
        $.get('/api/voyage/'+this.state.id, function (result) {
            var time_started = result.time_started === null ? 0 : Date.parse(result.time_started);
            var time_ended = result.time_ended === null ? 0 : Date.parse(result.time_ended);

            self.setState({
                time_started: time_started,
                time_ended: time_ended,
                from_place: result.to_place,
                to_place: result.from_place,
                type: result.type,
            });
        });
    }
});

ReactDOM.render(<Voyage/>, document.getElementById('voyage-react'));
