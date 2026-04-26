const axios = require('axios');
const qs = require('querystring');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const { code, title, format } = req.body;
        const API_KEY = 'GCrVRREjJkHDiTGavhfZipLDv1g_E7NJ'; // Aapki Key

        const data = {
            api_dev_key: API_KEY,
            api_option: 'paste',
            api_paste_code: code,
            api_paste_name: title || 'Untitled Paste',
            api_paste_format: format || 'text',
            api_paste_private: '0', // 0 = Public, 1 = Unlisted
            api_paste_expire_date: 'N' // N = Never
        };

        const response = await axios.post('https://pastebin.com/api/api_post.php', qs.stringify(data));

        if (response.data.includes('https://pastebin.com/')) {
            res.status(200).json({ success: true, url: response.data });
        } else {
            res.status(400).json({ success: false, message: response.data });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
