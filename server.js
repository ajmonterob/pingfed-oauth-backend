const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const AUTH_URL = process.env.AUTH_URL;
const TOKEN_URL = process.env.TOKEN_URL;

app.get('/login', (req, res) => {
    const authUri = `${AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid profile email`;
    res.redirect(authUri);
});

app.get('/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send('Authorization code missing');

    try {
        const response = await axios.post(TOKEN_URL, new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error exchanging code for token');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
