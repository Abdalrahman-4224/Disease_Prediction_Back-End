const http = require("http");
const https = require('https');
const fs = require('fs');
const app = require("./app");
const port = process.env.PORT || 3000;
const ip = process.env.IP || "192.168.80.85";


let server = null
try {
    const options = {
        key: fs.readFileSync('C:\\SSL\\ssl.key'),
        cert: fs.readFileSync('C:\\SSL\\ssl.crt')
    };
    
    
    server = https.createServer(options, app);
} catch (error) {
    server = http.createServer(app);
}


server.listen(port);
console.log("**************", ip + ":" + port, "**************");
