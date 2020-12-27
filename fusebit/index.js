const Sdk = require("@fusebit/add-on-sdk");
const Superagent = require("superagent");

/**
 * @param ctx {FusebitContext}
 * @param cb {FusebitCallback}
 */
module.exports = async (ctx) => {
  Sdk.debug("REQUEST", ctx.method, ctx.url, ctx.body);
  const storage = await Sdk.createStorageClient(
    ctx,
    ctx.fusebit.functionAccessToken,
    `/boundary/${ctx.boundaryId}/function/${ctx.functionId}/`
  );
  const ensureTunnel = async () => {
    const data = await storage.get();
    const url = data && data.data && data.data.url;
    if (!url) {
      throw { status: 502, message: "Tunnel to Raspberry PI is not availale." };
    }
    Sdk.debug("Tunnel to Raspberry PI is", url);
    return url;
  };
  try {
    if (ctx.method === "POST") {
      if (ctx.url.match(/\/tunnel/)) {
        if (!ctx.body.url) {
          throw {
            status: 400,
            message: "The `url` body property must be specified.",
          };
        }
        Sdk.debug("Registering new tunnel url", ctx.body.url);
        await storage.put({ data: { url: ctx.body.url } });
        return { status: 200 };
      } else if (ctx.url.match(/\/switch/)) {
        if (typeof ctx.body.state !== "boolean") {
          throw {
            status: 400,
            message: "The `state` body property must be a boolean.",
          };
        }
        const url = await ensureTunnel();
        Sdk.debug("Changing switch status to", ctx.body.switch);
        const response = await Superagent.post(`${url}/api/switch/0`)
          .send({ state: ctx.body.state })
          .ok((res) => true);
        return { status: response.status, body: response.body };
      } else {
        return { status: 404 };
      }
    } else if (ctx.method === "GET" && ctx.url.match(/\/switch/)) {
      const url = await ensureTunnel();
      Sdk.debug("Querying switch status");
      const response = await Superagent.get(`${url}/api/switch/0`).ok(
        (res) => true
      );
      return { status: response.status, body: response.body };
    } else {
      return { status: 404 };
    }
  } catch (e) {
    return {
      status: e.status || 500,
      body: { status: e.status || 500, message: e.message },
    };
  }

  return { body: "Hello" };
};
