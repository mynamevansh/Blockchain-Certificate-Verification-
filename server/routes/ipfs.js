const express = require('express');
const router = express.Router();

const IPFS_GATEWAYS = [
    "https://gateway.pinata.cloud/ipfs/",
    "https://cloudflare-ipfs.com/ipfs/",
    "https://dweb.link/ipfs/",
    "https://ipfs.io/ipfs/",
    "https://gateway.ipfs.io/ipfs/"
];

const TIMEOUT_MS = 30000;

const fetchWithTimeout = (url, timeout = TIMEOUT_MS) => {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Gateway timeout')), timeout)
        )
    ]);
};

/**
 * GET /api/ipfs/fetch/:cid
 * Fetch file from IPFS using multiple gateway fallbacks
 */
router.get('/fetch/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        if (!cid || cid.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'CID parameter is required'
            });
        }

        const cleanCid = cid.replace('ipfs://', '').trim();
        console.log(`🔄 Fetching IPFS content for CID: ${cleanCid}`);

        let lastError = null;

        // Try each gateway in sequence
        for (let i = 0; i < IPFS_GATEWAYS.length; i++) {
            try {
                const gatewayUrl = `${IPFS_GATEWAYS[i]}${cleanCid}`;
                console.log(`   Attempting gateway ${i + 1}/${IPFS_GATEWAYS.length}: ${IPFS_GATEWAYS[i]}`);

                const response = await fetchWithTimeout(gatewayUrl);

                if (response.ok) {
                    console.log(`✅ Successfully fetched from gateway ${i + 1}`);

                    // Get the content and determine type
                    const buffer = await response.arrayBuffer();
                    const contentType = response.headers.get('content-type') || 'application/octet-stream';

                    // Set appropriate headers
                    res.setHeader('Content-Type', contentType);
                    res.setHeader('Cache-Control', 'public, max-age=31536000');
                    res.setHeader('Access-Control-Allow-Origin', '*');

                    // Send the buffer
                    return res.send(Buffer.from(buffer));
                }
            } catch (error) {
                lastError = error;
                console.log(`   ⚠️ Gateway ${i + 1} failed: ${error.message}`);
                continue;
            }
        }

        // All gateways failed
        console.error(`❌ All IPFS gateways failed for CID: ${cleanCid}`);
        return res.status(503).json({
            success: false,
            message: 'Unable to fetch from IPFS',
            details: lastError?.message || 'All gateways exhausted',
            cid: cleanCid
        });

    } catch (error) {
        console.error('❌ IPFS fetch error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching from IPFS',
            error: error.message
        });
    }
});

/**
 * GET /api/ipfs/status
 * Check IPFS gateway status
 */
router.get('/status', async (req, res) => {
    try {
        const status = {
            gateways: []
        };

        for (const gateway of IPFS_GATEWAYS) {
            try {
                const response = await Promise.race([
                    fetch(`${gateway}QmUNLLsPAqgHDxEV7xQrVReAiak6D68LJnidingsMotion`),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Timeout')), 5000)
                    )
                ]);
                status.gateways.push({
                    url: gateway,
                    status: response.ok ? 'online' : 'offline',
                    statusCode: response.status
                });
            } catch (error) {
                status.gateways.push({
                    url: gateway,
                    status: 'offline',
                    error: error.message
                });
            }
        }

        res.json({
            success: true,
            data: status
        });
    } catch (error) {
        console.error('Error checking IPFS status:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking IPFS status',
            error: error.message
        });
    }
});

module.exports = router;
