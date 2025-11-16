// src/pages/api/payments/mpesa.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/callback`,

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { phone_number, amount, listingId } = req.body;

  try {
    // 1. Get access token from M-Pesa
    const tokenResponse = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      auth: {
        username: process.env.MPESA_CONSUMER_KEY!,
        password: process.env.MPESA_CONSUMER_SECRET!,
      },
    });
    const accessToken = tokenResponse.data.access_token;

    // 2. Make STK Push request
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    const stkPushResponse = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone_number,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone_number,
        CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/callback`,
        AccountReference: `RentMe-${listingId}`,
        TransactionDesc: `Payment for listing ${listingId}`,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.status(200).json({ success: true, data: stkPushResponse.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'M-Pesa request failed' });
  }
}
