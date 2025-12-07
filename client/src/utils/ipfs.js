import { API_BASE_URL } from '../constants';

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

export const resolveIPFS = (cid) => {
    if (!cid) return '';
    const cleanCid = cid.replace('ipfs://', '');
    return `${API_BASE_URL}/api/ipfs/fetch/${cleanCid}`;
};

export const fetchFromIPFS = async (cid) => {
    if (!cid) return null;
    const cleanCid = cid.replace('ipfs://', '');

    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/api/ipfs/fetch/${cleanCid}`);

        if (response.ok) {
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();
                return result.data || result;
            } else if (contentType && (contentType.includes('image') || contentType.includes('pdf'))) {
                const blob = await response.blob();
                return { blob, url: URL.createObjectURL(blob) };
            } else {
                return await response.text();
            }
        } else {
            throw new Error(`Backend proxy failed: ${response.status}`);
        }
    } catch (error) {
        console.warn('IPFS fetch through backend failed:', error);
        console.log('Falling back to direct gateway access...');

        for (const gateway of IPFS_GATEWAYS) {
            try {
                const response = await fetchWithTimeout(`${gateway}${cleanCid}`);
                if (response.ok) {
                    try {
                        return await response.json();
                    } catch (e) {
                        console.warn('Content is not JSON, returning text');
                        return { text: await response.text() };
                    }
                }
            } catch (error) {
                console.warn(`Gateway ${gateway} failed:`, error.message);
                continue;
            }
        }

        throw new Error("All IPFS access methods failed");
    }
};
