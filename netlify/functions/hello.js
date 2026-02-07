// Example Netlify Function
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'M-Pesewa API Function',
      timestamp: new Date().toISOString(),
      country: event.headers['x-country-code'] || 'KE'
    })
  };
};