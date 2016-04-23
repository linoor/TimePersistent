var ReactDOM = require('react-dom');
var React = require('react');
window.jQuery = window.$ = require('jquery');
var bootstrap = require('bootstrap');

var Voyage = React.createClass({
    getInitialState: function () {
        var slug = window.location.href.split('/');
        return {
            id: slug[slug.length-1],
        }
    },

    render: function() {
        var elapsed = Math.abs(new Date() - this.state.time_started) / 60;
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12">
                        <h1 className="voyage-title">Voyage {this.state.id}</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <h2 className="voyage-place">{this.state.from_place}</h2>
                    </div>
                    <div className="col-md-6">
                        <h2 className="voyage-place">{this.state.to_place}</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <h2 className="voyage-date">{this.state.time_started}</h2>
                    </div>
                    <div className="col-md-6">
                        <h2 className="voyage-date">{this.state.time_ended}</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-10">
                        <span>{elapsed}</span>
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

            var minutes, seconds;
            self.setState({
                time_started: time_started,
                from_place: result.to_place,
                to_place: result.from_place,
                type: result.type,
            });
            if (self.state.time_ended == 0) {
                minutes = Math.floor(delta / 60);
                self.setState({
                    time_ended: time_ended
                });
            }
        });
    }
});

ReactDOM.render(<Voyage/>, document.getElementById('voyage-react'));
