const mockttp = require('mockttp');
const fs = require('fs').promises;

(async () => {
    // Generate CA certificate
    
    // Write key and cert to files using promises
    key = await fs.readFile("key.pem", 'utf8');
    cert = await fs.readFile("cert.pem", 'utf8');

    // Create a proxy server with a self-signed HTTPS CA certificate
    const https = { key, cert };
    const server = mockttp.getLocal({ https });

    // Log details of incoming requests and modify the Host header
    server.forAnyRequest().thenForwardTo('https://swosa.vercel.app/', {
        beforeRequest: (req) => {
            console.log('Incoming Request:');
            console.log(`Method: ${req.method}`);
            console.log(`URL: ${req.url}`);
            console.log('Headers:', req.headers);

            // Modify the Host header
            req.headers['host'] = 'swosa.vercel.app'; // Replace with the desired host

            return req;
        }
    });

    // Start the server
    await server.start();

    // Print out the server details
    const caFingerprint = mockttp.generateSPKIFingerprint(cert);
    console.log(`Server running on port ${server.port}`);
    console.log(`CA cert fingerprint ${caFingerprint}`);
})();
