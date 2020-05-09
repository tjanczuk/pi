module.exports = ws => {
    console.log('NEW WS CONNECTION!');
    ws.on('message', m => {
        console.log('MESSAGE', m);
    });
    ws.send(JSON.stringify({ foo: 'bar' }));
};
