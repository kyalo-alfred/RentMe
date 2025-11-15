// src/pages/api/payments/callback.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// This endpoint receives M-Pesa payment notifications
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    const body = req.body;

    /**
     * Example of the payload M-Pesa sends:
     * {
     *   "Body": {
     *     "stkCallback": {
     *       "MerchantRequestID": "12345",
     *       "CheckoutRequestID": "ws_CO_12345",
     *       "ResultCode": 0,
     *       "ResultDesc": "The service request is processed successfully.",
     *       "CallbackMetadata": {
     *         "Item": [
     *           { "Name": "Amount", "Value": 100 },
     *           { "Name": "MpesaReceiptNumber", "Value": "ABCDE12345" },
     *           { "Name": "Balance" },
     *           { "Name": "TransactionDate", "Value": 20251115123456 },
     *           { "Name": "PhoneNumber", "Value": 254700000000 }
     *         ]
     *       }
     *     }
     *   }
     * }
     */

    const callback = body.Body.stkCallback;
    const resultCode = callback.ResultCode;

    if (resultCode === 0) {
      const items = callback.CallbackMetadata.Item;
      const amount = items.find((i: any) => i.Name === 'Amount')?.Value;
      const receipt = items.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
      const phone = items.find((i: any) => i.Name === 'PhoneNumber')?.Value;
      const transactionDate = items.find((i: any) => i.Name === 'TransactionDate')?.Value;

      // Here you should update your database to mark the listing as paid
      console.log(`Payment successful! Amount: ${amount}, Receipt: ${receipt}, Phone: ${phone}, Date: ${transactionDate}`);

      // Respond to M-Pesa to acknowledge receipt
      res.status(200).json({ success: true });
    } else {
      console.log(`Payment failed or cancelled: ${callback.ResultDesc}`);
      res.status(200).json({ success: false, message: callback.ResultDesc });
    }
  } catch (err) {
    console.error('Error handling M-Pesa callback:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
