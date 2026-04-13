const fs = require('fs');
const path = require('path');
const axios = require('axios');

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
    console.warn('⚠️  WARNING: Pinata credentials not configured in environment variables');
}

const testConnection = async () => {
    try {
        if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
            throw new Error('Pinata credentials missing. Set PINATA_API_KEY and PINATA_SECRET_API_KEY environment variables.');
        }

        const response = await axios.get('https://api.pinata.cloud/data/testAuthentication', {
            headers: {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_API_KEY
            }
        });

        if (response.status === 200) {
            console.log('✅ Pinata Connection Successful');
            return true;
        }
    } catch (error) {
        console.error('❌ Pinata Connection Failed:', error.response?.data?.error || error.message);
        return false;
    }
};

const uploadToPinata = async (filePath, metadata = {}) => {
    try {
        if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
            throw new Error('Pinata credentials not configured');
        }

        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const fileStream = fs.createReadStream(filePath);
        const fileName = path.basename(filePath);

        const formData = new FormData();
        const blob = fs.readFileSync(filePath);
        formData.append('file', blob, fileName);

        const metadata_json = {
            name: metadata.name || 'Certificate',
            keyvalues: metadata.keyvalues || {}
        };
        formData.append('pinataMetadata', JSON.stringify(metadata_json));
        formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            headers: {
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_API_KEY,
                ...formData.getHeaders?.()
            },
            timeout: 30000
        });

        if (response.status === 200 && response.data.IpfsHash) {
            console.log('✅ File uploaded to IPFS. CID:', response.data.IpfsHash);
            return response.data;
        } else {
            throw new Error('Invalid response from Pinata API');
        }
    } catch (error) {
        console.error('❌ Error uploading to Pinata:', error.response?.data || error.message);
        throw new Error(`Pinata upload failed: ${error.response?.data?.error || error.message}`);
    }
};

module.exports = { testConnection, uploadToPinata };
