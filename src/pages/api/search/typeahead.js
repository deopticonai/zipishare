import { NextResponse } from 'next/server';

const unirest = require('unirest');

export default async function GET(req, res) {
    const apiKey = process.env.XAPIKey;
    const BASE_URL = process.env.BASE_URL;
    console.log(apiKey + ' ' + BASE_URL)
    const query = req.query.q;
    const show_podcasts = req.query.show_podcasts
    const show_genres = req.query.show_genres
    const safe_mode = req.query.safe_mode
    const len_min = req.query.len_min

    console.log(query + show_podcasts + show_genres + safe_mode + len_min);

    const response = await unirest.get(`${BASE_URL}/typeahead?q=${query}&show_podcasts=${show_podcasts || 1}&show_genres=${show_genres || 1}&safe_mode=${safe_mode || 0}`)
        .header('X-ListenAPI-Key', apiKey)

        console.log(response)
    return res.json(response)
}