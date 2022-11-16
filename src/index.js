
//An asteroid stores a location,
//a velocity, and details about drawing it
class Asteroid {
    //Initialize a new asteroid
    constructor(x, y, vx, vy, MAXRADIUS) {
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
        this.r = Math.random() * MAXRADIUS

        var rand = Math.random()
        if (rand <= 0.5) {
            this.fillStyle = "rgba(255, 255, 255, 1)"
            this.shadowColor = "rgba(255, 255, 255, 0.5)"
            this.shadowBlur = 3
        }
        else if (rand > 0.75) {
            this.fillStyle = "rgba(255, 254, 196, 1)"
            this.shadowColor = "rgba(255, 254, 196, 0.5)"
            this.shadowBlur = 4
        }
        else {
            this.fillStyle = "rgba(192, 247, 255, 1)"
            this.shadowColor = "rgba(192, 247, 255, 0.5)"
            this.shadowBlur = 7
        }
    }

    //Move it as if one unit of time has passed
    update() {
        this.x += this.vx
        this.y += this.vy
    }

    //Check if the asteroid has left the screen
    inBounds(w, h) {
        return this.x < w && this.y < h
    }

    //Draw the asteroid to the canvas
    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
        ctx.fillStyle = this.fillStyle
        ctx.shadowColor = this.shadowColor
        ctx.shadowBlur = this.shadowBlur
        ctx.fill()
    }
}
class Simulation {
    //This stores the state of the simulation
    constructor(width, height) {
        //
        this.asteroids = []
        this.width = width
        this.height = height
        this.paused = false
    
	this.MAXVELOCITY = 5
	this.AVGSLOPE = 10
	this.PROBNEWASTEROID = 0.5
	this.MAXRADIUS = 15

    }

    //Draw the current state of the simulation to the screen
    paint(canvas, ctx) {
        //clear the screen
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        //draw each asteroid
        for (let asteroid of this.asteroids) {
            asteroid.draw(ctx)
        }
    }

    //Calls update on each asteroid
    //Deletes all out of bounds asteroids
    //Possibly creates a new asteroid
    update() {
        if( this.paused ){
            return
        }
        for (let asteroid of this.asteroids) {
            asteroid.update()
        }
        this.asteroids = this.asteroids.filter((asteroid) => {
            return asteroid.inBounds(this.width, this.height)
        })
        this.randomAsteroids()
    }

    //Possibly adds a new asteroid
    randomAsteroids() {
        if (Math.random() <= this.PROBNEWASTEROID) {
            this.asteroids.push(
                new Asteroid(
                    Math.random() * this.width,         //random x
                    0,                                  //top of screen
                    Math.random() * this.MAXVELOCITY * 0.5 - this.MAXVELOCITY * 0.25,// / this.AVGSLOPE,// - this.MAXVELOCITY / (this.AVGSLOPE * 2),
                    Math.random() * this.MAXVELOCITY,  //random positive y velocity
		    this.MAXRADIUS
		)
            )
        }
    }
}


class App extends React.Component {
    constructor(props){
        super(props)
        this.simul = new Simulation(10000, 10000)
        this.simul.randomAsteroids()
        this.canvasRef = React.createRef()
    }

    componentDidMount(){
	window.addEventListener( 'keydown', this.onKeyDown.bind(this) )
        //Start the animation loop
        requestAnimationFrame(this.updateBackgroundSimulation.bind(this))
    }
    
    //Updates the simulation
    updateBackgroundSimulation(){
        this.simul.update()
        this.canvas = this.canvasRef.current
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.simul.paint(this.canvas, this.canvas.getContext('2d'))
        requestAnimationFrame(this.updateBackgroundSimulation.bind(this))
    }


    onKeyDown(e){
	console.log( e.keyCode )
    	if( e.keyCode == 37 ){			//left
		this.simul.MAXVELOCITY /= 2
	}else if( e.keyCode == 38 ){		//up
		this.simul.PROBNEWASTEROID *= 2
	}else if( e.keyCode == 39 ){		//right
		this.simul.MAXVELOCITY *= 2
	}else if( e.keyCode == 40 ){		//down
		this.simul.PROBNEWASTEROID /= 2
	}else if( e.keyCode == 32 ){		//enter
        	this.simul.paused = !this.simul.paused
	}
	console.log( this.simul )
    }

    render(){
        //Render the background simulation
        return <canvas ref={this.canvasRef}
            style={{
                backgroundColor: "#2e2e2e",
                position: "fixed",
                zIndex: -100,
                top: 0,
                left: 0
            }}
            ></canvas>
    }
}


ReactDOM.createRoot(document.getElementById('root')).render(<App />);
