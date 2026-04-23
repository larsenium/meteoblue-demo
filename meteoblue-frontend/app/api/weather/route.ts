import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(
  request: Request
) {
  // Parse query params for dynamic lat/lon (optional)
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat') || '47.558';
  const lon = searchParams.get('lon') || '7.573';

  const sharedSecret = process.env.METEOBLUE_SECRET || "DEMOKEY";
  const expire = Math.floor(Date.now() / 1000) + 3600; // 1 hour expiry

  const query = `/packages/basic-1h-basic-day?lat=${lat}&lon=${lon}&asl=279&tz=Europe/Zurich&name=Basel&format=json&history_days=1&apikey=DEMOKEY&expire=${expire}`;

  const sig = crypto.createHmac('sha256', sharedSecret).update(query).digest('hex');
  const signedUrl = 'https://my.meteoblue.com/packages/basic-1h_basic-day?lat=47.558&lon=7.573&asl=279&tz=Europe%2FZurich&name=Basel&format=json&history_days=1&apikey=DEMOKEY&sig=3413036bf33758dd1cc57596bf520ca0';
   //`https://my.meteoblue.com${query}&sig=${sig}`;



  try {
    const res = await fetch(signedUrl, {
      headers: { 'User-Agent': 'Next.js MeteoBlue Proxy' }
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `MeteoBlue API failed: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}