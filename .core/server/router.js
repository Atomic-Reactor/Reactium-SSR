import express from 'express';
import renderer from './renderer';
import fs from 'fs';
import path from 'path';
import httpAuth from 'http-auth';
import SDK from '@atomic-reactor/reactium-sdk-core';

const router = express.Router();

// Conditional basic auth
const basicAuthFile = path.resolve(process.env.BASIC_AUTH_FILE || '.htpasswd');
if (fs.existsSync(basicAuthFile)) {
    router.use((req, res, next) => {
        if (req.url !== '/elb-healthcheck') {
            let basic = httpAuth.basic({
                realm: 'Reactium.',
                file: basicAuthFile,
            });

            httpAuth.connect(basic)(req, res, next);
        } else {
            next();
        }
    });
}

router.get('/elb-healthcheck', (req, res) => res.send('Up'));

process.on('unhandledRejection', (reason, p) => {
    console.log(
        '[Reactium] Unhandled Rejection at: Promise',
        p,
        'reason:',
        reason,
    );
    // application specific logging, throwing an error, or other logic here
});

router.use(async (req, res, next) => {
    const [url] = req.originalUrl.split('?');
    const parsed = path.parse(path.basename(url));

    // Slim down index.html handling to paths that aren't handling a file extension
    if (['', 'htm', 'html'].includes(parsed.ext)) {
        const context = {};

        try {
            const content = await renderer(req, res, context);
            if (context.url) {
                console.log('[Reactium] Redirecting to ', context.url);
                return res.redirect(302, context.url);
            }

            const responseHeaders = {};
            SDK.Hook.runSync(
                'Server.ResponseHeaders',
                responseHeaders,
                req,
                res,
            );
            await SDK.Hook.run(
                'Server.ResponseHeaders',
                responseHeaders,
                req,
                res,
            );
            Object.entries(responseHeaders).forEach(([key, value]) =>
                res.set(key, value),
            );

            let status = 200;
            if (/^\/404/.test(req.path) || context.notFound) {
                status = 404;
            }

            res.status(status).send(content);
        } catch (err) {
            console.error('[Reactium] React SSR Error', err);
            res.status(500).send('[Reactium] Internal Server Error');
        }
    } else {
        // let assets naturally 404, or be handled by subsequent middleware
        next();
    }
});

export default router;
