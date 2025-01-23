const axios = require("axios");

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { amount, currency, sandbox } = body;

  const isSandbox = sandbox;
  const apiKey = isSandbox
    ? process.env.REVOLUT_API_KEY_SANDBOX
    : process.env.REVOLUT_API_KEY_PRODUCTION;
  const baseUrl = isSandbox
    ? process.env.REVOLUT_BASE_URL_SANDBOX
    : process.env.REVOLUT_BASE_URL_PRODUCTION;

  try {
    const response = await axios.post(
      `${baseUrl}/order`,
      { amount, currency, capture_mode: "automatic" },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.response ? error.response.data : error.message,
      }),
    };
  }
};
