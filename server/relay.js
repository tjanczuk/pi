const Superagent = require('superagent');

exports.relayBaseUrl = 'https://stage.us-west-2.fusebit.io/v1/run/sub-ed9d9341ea356841/tomek/pi';

exports.registerTunnel = async (url) => {
    await Superagent.post(`${exports.relayBaseUrl}/tunnel`)
        .send({ url });
};
