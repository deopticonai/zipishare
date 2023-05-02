
import { NextResponse } from 'next/server';

const unirest = require('unirest');

export default async function handler(req, res) {
  const apiKey = process.env.XAPIKey;
  const BASE_URL = process.env.BASE_URL;
  console.log(BASE_URL)
  const response = await unirest.get(`${BASE_URL}/genres?top_level_only=1`)
    .header('X-ListenAPI-Key', apiKey)
  console.log("AAAAAAAAAAAAAAA      " + response.toString())
  return res.json(response)
}