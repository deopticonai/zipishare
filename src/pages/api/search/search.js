import { NextResponse } from 'next/server';

const unirest = require('unirest');

export default async function GET(request, res) {
  const apiKey = process.env.XAPIKey;
  const BASE_URL = process.env.BASE_URL;

  const query = request.query.q;
  const sort_by_date = request.query.sort_by_date;
  const type = request.query.type;
  const offset = request.query.offset;
  const len_min = request.query.len_min;
  const len_max = request.query.len_max;
  const genre_ids = request.query.genre_ids;
  const published_before = request.query.published_before;
  const published_after = request.query.published_after;
  const only_in = request.query.only_in;
  const language = request.query.language;
  const safe_mode = request.query.safe_mode;
  const unique_podcasts = request.query.unique_podcasts;
  const page_size = request.query.page_size;


  const searchURL = (genre_ids !== null) ?
    `${BASE_URL}/search?q=${query}&sort_by_date=${sort_by_date || 0}&type=${type || "episode"}&offset=${offset || 0}&len_min=${len_min || 10}&len_max=${len_max || 30}&genre_ids=${genre_ids}&published_before=${published_before}&published_after=${published_after || 0}&only_in=${only_in || ""}&language=${language || "English"}&safe_mode=${safe_mode || 0}&unique_podcasts=${unique_podcasts || 0}&page_size=${page_size || 10}`
    :
    `${BASE_URL}/search?q=${query}&sort_by_date=${sort_by_date || 0}&type=${type || "episode"}&offset=${offset || 0}&len_min=${len_min || 10}&len_max=${len_max || 30}&published_before=${published_before}&published_after=${published_after || 0}&only_in=${only_in || ""}&language=${language || "English"}&safe_mode=${safe_mode || 0}&unique_podcasts=${unique_podcasts || 0}&page_size=${page_size || 10}`

  const response = await unirest.get(searchURL)
    .header('X-ListenAPI-Key', apiKey)

  return res.json(response)
}