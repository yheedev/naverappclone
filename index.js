// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// const { fileURLToPath } = require('url');
// const { dirname, join } = require('path');

import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(join('/src/result')));
app.use(express.static(join('/src/index')));

// const BASE_URL = window.location.hostname === "localhost" ? "" : "/proxy/";

app.use(
  cors({
    origin: [
      'http://127.0.0.1:3000',
      'https://regal-cassata-bf72c7.netlify.app',
    ],
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.get('/src/index', (res) => {
  res.sendFile(join(__dirname, 'src/index.html'));
});

app.get('/src/results', (res) => {
  res.sendFile(join(__dirname, 'src/results.html'));
})

app.get('/proxy/v1/search/blog', async (req, res) => {
  const query = req.query.query.trim();
  const API_URL = `/v1/search/blog?query=${encodeURIComponent(query)}&display=10&start=1&sort=date`;

  try {
    const response = await axios.get(API_URL, {
      headers: {
        'X-Naver-Client-Id': 'oINvcti2ijXhM9DxWau8',
        'X-Naver-Client-Secret': 'laXayxxY8j',
      }
    });

    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(error.response ? error.response.status : 500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});