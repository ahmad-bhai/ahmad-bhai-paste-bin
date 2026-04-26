const axios = require('axios');
const qs = require('querystring');

export default async function handler(req, res) {
    // CORS fix for BJS and Web
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const { code, title, format } = req.body;
        const API_KEY = 'GCrVRREjJkHDiTGavhfZipLDv1g_E7NJ';

        // Pastebin expects URL encoded data
        const params = qs.stringify({
            api_dev_key: API_KEY,
            api_option: 'paste',
            api_paste_code: code,
            api_paste_name: title || 'Ahmad Bhai Paste',
            api_paste_format: format || 'text',
            api_paste_private: '0',
            api_paste_expire_date: 'N'
        });

        const response = await axios.post('https://pastebin.com/api/api_post.php', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (typeof response.data === 'string' && response.data.includes('https://pastebin.com/')) {
            return res.status(200).json({ success: true, url: response.data });
        } else {
            return res.status(400).json({ success: false, message: response.data });
        }
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.response ? error.response.data : error.message 
        });
    }
}
