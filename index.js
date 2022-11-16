var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//An asteroid stores a location,
//a velocity, and details about drawing it
var Asteroid = function () {
    //Initialize a new asteroid
    function Asteroid(x, y, vx, vy, MAXRADIUS) {
        _classCallCheck(this, Asteroid);

        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.r = Math.random() * MAXRADIUS;

        var rand = Math.random();
        if (rand <= 0.5) {
            this.fillStyle = "rgba(255, 255, 255, 1)";
            this.shadowColor = "rgba(255, 255, 255, 0.5)";
            this.shadowBlur = 3;
        } else if (rand > 0.75) {
            this.fillStyle = "rgba(255, 254, 196, 1)";
            this.shadowColor = "rgba(255, 254, 196, 0.5)";
            this.shadowBlur = 4;
        } else {
            this.fillStyle = "rgba(192, 247, 255, 1)";
            this.shadowColor = "rgba(192, 247, 255, 0.5)";
            this.shadowBlur = 7;
        }
    }

    //Move it as if one unit of time has passed


    _createClass(Asteroid, [{
        key: "update",
        value: function update() {
            this.x += this.vx;
            this.y += this.vy;
        }

        //Check if the asteroid has left the screen

    }, {
        key: "inBounds",
        value: function inBounds(w, h) {
            return this.x < w && this.y < h;
        }

        //Draw the asteroid to the canvas

    }, {
        key: "draw",
        value: function draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
            ctx.fillStyle = this.fillStyle;
            ctx.shadowColor = this.shadowColor;
            ctx.shadowBlur = this.shadowBlur;
            ctx.fill();
        }
    }]);

    return Asteroid;
}();

var Simulation = function () {
    //This stores the state of the simulation
    function Simulation(width, height) {
        _classCallCheck(this, Simulation);

        //
        this.asteroids = [];
        this.width = width;
        this.height = height;
        this.paused = false;

        this.MAXVELOCITY = 5;
        this.AVGSLOPE = 10;
        this.PROBNEWASTEROID = 0.5;
        this.MAXRADIUS = 15;
    }

    //Draw the current state of the simulation to the screen


    _createClass(Simulation, [{
        key: "paint",
        value: function paint(canvas, ctx) {
            //clear the screen
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //draw each asteroid
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.asteroids[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var asteroid = _step.value;

                    asteroid.draw(ctx);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        //Calls update on each asteroid
        //Deletes all out of bounds asteroids
        //Possibly creates a new asteroid

    }, {
        key: "update",
        value: function update() {
            var _this = this;

            if (this.paused) {
                return;
            }
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.asteroids[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var asteroid = _step2.value;

                    asteroid.update();
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            this.asteroids = this.asteroids.filter(function (asteroid) {
                return asteroid.inBounds(_this.width, _this.height);
            });
            this.randomAsteroids();
        }

        //Possibly adds a new asteroid

    }, {
        key: "randomAsteroids",
        value: function randomAsteroids() {
            if (Math.random() <= this.PROBNEWASTEROID) {
                this.asteroids.push(new Asteroid(Math.random() * this.width, //random x
                0, //top of screen
                Math.random() * this.MAXVELOCITY * 0.5 - this.MAXVELOCITY * 0.25, // / this.AVGSLOPE,// - this.MAXVELOCITY / (this.AVGSLOPE * 2),
                Math.random() * this.MAXVELOCITY, //random positive y velocity
                this.MAXRADIUS));
            }
        }
    }]);

    return Simulation;
}();

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this2 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this2.simul = new Simulation(10000, 10000);
        _this2.simul.randomAsteroids();
        _this2.canvasRef = React.createRef();
        return _this2;
    }

    _createClass(App, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            window.addEventListener('keydown', this.onKeyDown.bind(this));
            //Start the animation loop
            requestAnimationFrame(this.updateBackgroundSimulation.bind(this));
        }

        //Updates the simulation

    }, {
        key: "updateBackgroundSimulation",
        value: function updateBackgroundSimulation() {
            this.simul.update();
            this.canvas = this.canvasRef.current;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.simul.paint(this.canvas, this.canvas.getContext('2d'));
            requestAnimationFrame(this.updateBackgroundSimulation.bind(this));
        }
    }, {
        key: "onKeyDown",
        value: function onKeyDown(e) {
            console.log(e.keyCode);
            if (e.keyCode == 37) {
                //left
                this.simul.MAXVELOCITY /= 2;
            } else if (e.keyCode == 38) {
                //up
                this.simul.PROBNEWASTEROID *= 2;
            } else if (e.keyCode == 39) {
                //right
                this.simul.MAXVELOCITY *= 2;
            } else if (e.keyCode == 40) {
                //down
                this.simul.PROBNEWASTEROID /= 2;
            } else if (e.keyCode == 32) {
                //enter
                this.simul.paused = !this.simul.paused;
            }
            console.log(this.simul);
        }
    }, {
        key: "render",
        value: function render() {
            //Render the background simulation
            return React.createElement("canvas", { ref: this.canvasRef,
                style: {
                    backgroundColor: "#2e2e2e",
                    position: "fixed",
                    zIndex: -100,
                    top: 0,
                    left: 0
                }
            });
        }
    }]);

    return App;
}(React.Component);

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App, null));