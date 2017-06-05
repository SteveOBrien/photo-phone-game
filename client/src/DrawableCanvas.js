import React, {Component} from 'react';

class DrawableCanvas extends Component {

    getValue(){
        return this.canvas.toDataURL();
    }

    clear(){
        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    componentDidMount() {

        if (this.canvas) {

            var drawTracker = {}, //Tracks the various touches so that we can support multitouch drawing
                MOUSE_ID = Object.freeze('mouse_event'),
                RADIUS = 3;

            let ctx = this.canvas.getContext('2d');
            ctx.lineJoin = ctx.lineCap = 'round';

            this.canvas.addEventListener('mousedown', startDrawingHandler);
            this.canvas.addEventListener('mousemove', function (event) {
                // get current mouse position
                if (typeof drawTracker[MOUSE_ID] === typeof {} && event.offsetX !== undefined) {
                    drawTracker[MOUSE_ID].updateCurrentPosition(event.offsetX, event.offsetY);
                    draw();
                }
            });
            document.addEventListener('mouseup', function () {
                // stop drawing
                delete drawTracker[MOUSE_ID];
            });

            this.canvas.addEventListener('touchstart', function (event) {
                //Prevent the mousedown handler from firing
                event.preventDefault();
                startDrawingHandler(event);
            });

            this.canvas.addEventListener('touchend', function (event) {
                event.preventDefault();
                var i;
                for (i = 0; i < event.changedTouches.length; i++) {
                    delete drawTracker[event.changedTouches[i].identifier];
                }
            });

            this.canvas.addEventListener('touchmove', function (event) {
                event.preventDefault();
                var i;
                if (event.changedTouches !== undefined) { //touch devices
                    for (i = 0; i < event.changedTouches.length; i++) {
                        drawTracker[event.changedTouches[i].identifier].updateCurrentPosition(Math.round(event.changedTouches[i].pageX - event.changedTouches[i].target.offsetLeft), Math.round(event.changedTouches[i].pageY) - event.changedTouches[i].target.offsetTop);
                    }
                }
                draw();
            });

            /**
             * Draws the points stored in the drawTracker to the canvas
             */
            function draw(isStart) {
                var key;
                for (key in drawTracker) {
                    if (drawTracker.hasOwnProperty(key)) {
                        console.log(key);
                        var lastPoint = drawTracker[key].lastPoint;
                        var currentPoint = drawTracker[key].currentPoint;
                        var dist = isStart ? 1 : distanceBetween(lastPoint, currentPoint);
                        var angle = angleBetween(lastPoint, currentPoint);
                        for (var i = 0; i < dist; i += 1) {

                            var x = lastPoint.x + (Math.sin(angle) * i);
                            var y = lastPoint.y + (Math.cos(angle) * i);

                            var radgrad = ctx.createRadialGradient(x, y, RADIUS * 0.25, x, y, RADIUS * 0.75);

                            radgrad.addColorStop(0, '#000');
                            radgrad.addColorStop(0.5, 'rgba(0,0,0,0.5)');
                            radgrad.addColorStop(1, 'rgba(0,0,0,0)');

                            ctx.fillStyle = radgrad;
                            ctx.fillRect(x - 20, y - 20, 40, 40);
                            drawTracker[key].resetLastPosition();
                        }
                    }

                }

            }


            /**
             * Handler for setting up a new series of lines to be drawn
             * @param {event} event The event that was fired to start drawing
             */
            function startDrawingHandler(event) {
                var i;
                if (event.offsetX !== undefined) {
                    drawTracker[MOUSE_ID] = new DrawData(event.offsetX, event.offsetY);
                }
                else if (event.changedTouches !== undefined) { //touch devices
                    for (i = 0; i < event.changedTouches.length; i++) {
                        drawTracker[event.changedTouches[i].identifier] = new DrawData(Math.round(event.changedTouches[i].pageX - event.changedTouches[i].target.offsetLeft), Math.round(event.changedTouches[i].pageY) - event.changedTouches[i].target.offsetTop);
                    }
                }

                draw(true);
            }

            /**
             * Represents a position
             * @param {number} x The starting x position
             * @param {number} y The starting y position
             * @constructor
             */
            function DrawData(x, y) {
                this.lastPoint = this.currentPoint = {
                    x: x,
                    y: y
                };

                this.updateCurrentPosition = function (x, y) {
                    this.currentPoint = {
                        x: x,
                        y: y
                    };
                }

                this.resetLastPosition = function () {
                    this.lastPoint = this.currentPoint;
                };
            }


            function distanceBetween(point1, point2) {
                return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
            }

            function angleBetween(point1, point2) {
                return Math.atan2(point2.x - point1.x, point2.y - point1.y);
            }

        }

    }

    render() {


        return (


            <canvas
                ref={(canvas) => {this.canvas = canvas;}}>
            </canvas>


        );


    }

}

export default DrawableCanvas;