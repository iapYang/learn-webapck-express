const express = require('express');
const bodyParser = require('body-parser');
const proxy = require('http-proxy-middleware');
const querystring = require('querystring');

const proxyConfig = require('./proxy.config');

const app = express();

// make http proxy middleware setting
const createProxySetting = url => {
    return {
        target: url,
        changeOrigin: true,
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        onProxyReq: (proxyReq, req) => {
            if (req.method === 'POST' && req.body) {
                const bodyData = querystring.stringify(req.body);
                proxyReq.write(bodyData);
            }
        },
    };
};

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// proxy
proxyConfig.forEach(item => {
    app.use(item.url, proxy(createProxySetting(item.target)));
});

// eg: http://127.0.0.1:3000/back_end/oppor => http://10.2.0.1:8352/back_end/oppor
