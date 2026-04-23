'use server';

import crypto from 'crypto';

export async function getWeatherData() {
  const sharedSecret = process.env.METEOBLUE_SECRET || "MySharedSecret"; // Use .env!
  const baseQuery = "/packages/basic-1h-basic-day?lat=47.558&lon=7.573&asl=279&tz=Europe/Zurich&name=Basel&format=json&history_days=1&apikey=DEMOKEY&expire=1924948800";

  const query = baseQuery; // Add params as needed
  const sig = crypto.createHmac('sha256', sharedSecret).update(query).digest('hex');
  const signedUrl = `https://my.meteoblue.com${query}&sig=${sig}`;

  const res = await fetch(signedUrl);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}