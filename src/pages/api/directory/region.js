import { NextResponse } from 'next/server';

const unirest = require('unirest');

export default async function GET(req, res) {
  const apiKey = process.env.XAPIKey;
  const BASE_URL = process.env.BASE_URL;


  const response = await unirest.get(`${BASE_URL}/regions`)
    .header('X-ListenAPI-Key', apiKey)
  return res.json(response)
}

