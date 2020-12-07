var Gpio = require('onoff').Gpio; 
var ws281x = require('rpi-ws281x-v2');
const debug = require('debug')('server:server');

class Motor {
    constructor(enable, input1, input2) {
        this.enable = new Gpio(enable, 'out');
        this.input1 = new Gpio(input1, 'out');
        this.input2 = new Gpio(input2, 'out');
        this.input1.writeSync(0);
        this.input2.writeSync(0);
        this.enable.writeSync(1);
    }

    destruct() {
        this.enable.writeSync(0);
        this.input1.writeSync(0);
        this.input2.writeSync(0);
        this.enable.unexport();
        this.input1.unexport();
        this.input2.unexport();
    }

    forward() {
        this.input1.writeSync(1);
        this.input2.writeSync(0);
    }

    backward() {
        this.input1.writeSync(0);
        this.input2.writeSync(1);
    }

    stop() {
        this.input1.writeSync(0);
        this.input2.writeSync(0);
    }
}

const Lamp = {
    FrontLeft: 6,
    FrontRight: 1,
    FrontLeftTurning: 7,
    FrontRightTurning: 0,
    BackLeftRed: 22,
    BackRightRed: 17,
    BackLeftTurning: 23,
    BackRightTurning: 16,
    BackLeftBacking: 21,
    BackRightBacking: 18,
};

const Colors = { // rgb
    Off: 0,
    White: 255 << 16 | 255 << 8 | 255,
    Red: 255 << 16,
    Orange: 255 << 16 | 200 << 8,
}

const Turning = {
    Left: 'left',
    Right: 'right'
}

var lightsConfigured = false;

class Lights {
    constructor() {
        this.on = false;
        this.turning = undefined;
        this.status = new Uint32Array(24);
        this.status.fill(0);
        this.blinker = setInterval(() => {
            if (this.turning) {
                this.turningState = !this.turningState;
                switch (this.turning) {
                    case 'left':
                        this.status[Lamp.FrontLeftTurning] = this.turningState ? Colors.Orange : Colors.Off;
                        this.status[Lamp.BackLeftTurning] = this.turningState ? Colors.Orange : Colors.Off;
                        this.status[Lamp.FrontRightTurning] = Colors.Off;
                        this.status[Lamp.BackRightTurning] = Colors.Off;
                        break;
                    case 'right': 
                        this.status[Lamp.FrontRightTurning] = this.turningState ? Colors.Orange : Colors.Off;
                        this.status[Lamp.BackRightTurning] = this.turningState ? Colors.Orange : Colors.Off;
                        this.status[Lamp.FrontLeftTurning] = Colors.Off;
                        this.status[Lamp.BackLeftTurning] = Colors.Off;
                        break;
                    default: 
                        this.status[Lamp.FrontRightTurning] = Colors.Off;
                        this.status[Lamp.BackRightTurning] = Colors.Off;
                        this.status[Lamp.FrontLeftTurning] = Colors.Off;
                        this.status[Lamp.BackLeftTurning] = Colors.Off;
                        break;
                };
                ws281x.render(this.status);
            }
        }, 500);
        if (!lightsConfigured) {
            ws281x.configure({ leds: 24, brightness: 100, strip: 'grb' });
            lightsConfigured = true;
        }
        ws281x.render(this.status);
        this.set(false, false, true);
    }

    destruct() {
        this.set(false, false, false);
        if (this.blinker) {
            clearInterval(this.blinker);
            this.blinker = undefined;
        }
    }

    set(backing, turning, on) {
        this.status.fill(0);
        if (on === true || on === false) {
            this.on = on;
        }
        this.status[Lamp.FrontLeft] = this.on ? Colors.White : Colors.Off;
        this.status[Lamp.FrontRight] = this.on ? Colors.White : Colors.Off;
        this.status[Lamp.BackLeftRed] = this.on ? Colors.Red : Colors.Off;
        this.status[Lamp.BackRightRed] = this.on ? Colors.Red : Colors.Off;
        this.status[Lamp.BackLeftBacking] = (this.on && backing) ? Colors.White : Colors.Off;
        this.status[Lamp.BackRightBacking] = (this.on && backing) ? Colors.White : Colors.Off;
        this.turning = turning;
        this.turningState = false;
        // debug(backing, turning, on, this.status);
        ws281x.render(this.status);
    }

}

class Robot {
    constructor() {
        this.led = new Gpio(4, 'out');
        this.left = new Motor(25, 24, 23);
        this.right = new Motor(17, 27, 22);
        this.lights = new Lights();
        process.on('exit', () => this.destruct());
    }

    destruct() {
        this.off();
        this.led.unexport();
        this.led = undefined;
        this.left.destruct();
        this.left = undefined;
        this.right.destruct();
        this.right = undefined;
        this.lights.destruct();
        this.lights.undefined;
    }

    on() {
        this.led.writeSync(1);
    }

    off() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }    
        this.led.writeSync(0);
    }

    blink(duration) { 
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(() => this.led.writeSync(this.led.readSync() ? 0 : 1), duration || 500);
    }

    forward() {
        this.left.forward();
        this.right.forward();
    }

    backward() {
        this.left.backward();
        this.right.backward();
    }

    stop() {
        this.left.stop();
        this.right.stop();
    }
}

module.exports = Robot;
module.exports.Lights = Lights;