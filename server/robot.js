var Gpio = require('onoff').Gpio; 

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

class Robot {
    constructor() {
        this.led = new Gpio(4, 'out');
        this.left = new Motor(25, 24, 23);
        this.right = new Motor(17, 27, 22);
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