/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const userIPAddress = request.headers.get('cf-connecting-ip');
  const response = await fetch(`https://ipinfo.io/${userIPAddress}/json`);
  const data = await response.json();

  // Extract IP, country, and ASN information
  const clientIP = data.ip;
  const country = data.country;
  const asn = data.org;

  // Check if the user is from Singapore (country code "SG")
  if (country === 'SG') {
    // If user is from Singapore, show the custom response
    const responseBody = `This is your ${clientIP} and you are accessing this site from ${country} | ${asn}.`;
    return new Response(responseBody, {
      headers: { 'Content-Type': 'text/html' },
    });
  } else {
    // If user is not from Singapore, redirect to 1.1.1.1
    return Response.redirect('https://1.1.1.1/', 302); // 302 is a temporary redirect
  }
}

;
