const debug = require('debug')('server:server');
const Robot = require('./robot');

let robot;

const killRobot = () => {
    if (robot) {
        robot.destruct();
        robot = undefined;
    }
};

const movements = {
    '0000' : ['stop', 'stop', 'Stopped!'],
    '0001' : ['stop', 'backward', 'Turning right by backing up!'],
    '0010' : ['stop', 'forward', 'Turning left by forwarding!'],
    '0011' : ['stop', 'stop', `I am confused, I can't go forward and back at the same time!`],
    '0100' : ['backward', 'stop', 'Turning left by backing up!'],
    '0101' : ['backward', 'backward', 'Backing up!'],
    '0110' : ['backward', 'forward', 'Spin left!'],
    '0111' : ['stop', 'stop', 'I am confused, too many buttons!'],
    '1000' : ['forward', 'stop', 'Turning right by forwarding!'],
    '1001' : ['forward', 'backward', 'Spin right!'],
    '1010' : ['forward', 'forward', 'Forward!'],
    '1011' : ['stop', 'stop', 'I am confused, too many buttons!'],
    '1100' : ['stop', 'stop', 'I am confused, too many buttons!'],
    '1101' : ['stop', 'stop', 'I am confused, too many buttons!'],
    '1110' : ['stop', 'stop', 'I am confused, too many buttons!'],
    '1111' : ['stop', 'stop', 'I am confused, too many buttons!'],
};

module.exports = ws => {
    debug('New websocket connection');

    const message = message => ws.send(JSON.stringify({ message }));

    killRobot();
    robot = new Robot();

    message('Welcome!');

    ws.on('message', m => {
        debug('Message', m);

        try {
            m = JSON.parse(m);
        }
        catch (e) {
            return message(`Sorry, I did not understand that: ${m}`);
        }

        if (!robot) return;

        if (m.led) {
            robot.on();
            message('Light on!');
        }
        else {
            robot.off();
            message('Light off!');
        }

        let state = `${m.lf ? '1' : '0'}${m.lb ? '1' : '0'}${m.rf ? '1' : '0'}${m.rb ? '1' : '0'}`;

        if (state === '0000') {
            robot.left.stop();
            robot.right.stop();
            robot.lights.set(0, 0);
            message('Stopped.');
        }
        else if (state === '0001') {
            robot.left.stop();
            robot.right.backward();
            robot.lights.set(1, 'left');
            message('Turning right using right wheel.');
        }
        else if (state === '0010') {
            robot.left.stop();
            robot.right.forward();
            robot.lights.set(0,'left');
            message('turning left!');
        }
        else if (state === '0011') {
            robot.left.stop();
            robot.right.stop();
            robot.lights.set(0,0);
            message('I AM CONFUSED!!!!');
        }
        else if (state === '0100') {
            robot.left.backward() ;
            robot.right.stop() ;
            message('turning left') ;
            robot.lights.set(1,'right');
        }
        else if (state === '0101') {
            robot.left.backward();
            robot.right.backward();
            robot.lights.set(1,0);
            message('GOING BACK!');
        }
        else if (state === '0110') {
            robot.left.backward();
            robot.right.forward();
            robot.lights.set(0,'left');
            message('fast left') ;
        }
        else if (state === '1000') {
            robot.left.forward();
            robot.right.stop();
            robot.lights.set(0,'right');
            message('turning right');
        }
        else if (state === '1001') {
            robot.left.forward();
            robot.right.backward();
            robot.lights.set(0,'right');
            message('fast right');
        }
        else if (state === '1010') {
            robot.left.forward();
            robot.right.forward();
            robot.lights.set(0,0);
            message('forward');
        }
        else {
            robot.left.stop();
            robot.right.stop();
            robot.lights.set(0,0);
            message('I AM CONFUSED... AGAIN');
        }

        // let movementKey = `${m.lf ? '1' : '0'}${m.lb ? '1' : '0'}${m.rf ? '1' : '0'}${m.rb ? '1' : '0'}`;
        // let movement = movements[movementKey];
        // if (!movement) {
        //     return message('I did not get the instruction');
        // }
        // debug('MOVEMENT', movement);
        // robot.left[movement[0]]();
        // robot.right[movement[1]]();
        // message(movement[2]);
    });

    ws.on('error', e => {
        debug('Error', e);
        killRobot();
    });

    ws.on('close', () => {
        debug('Close');
        killRobot();
    });
};
