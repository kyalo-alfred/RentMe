from django.shortcuts import render

# Create your views here.
from django.conf import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view
import requests
from datetime import datetime

@api_view(['POST'])
def mpesa_payment(request):
    phone_number = request.data.get('phone_number')
    amount = request.data.get('amount')

    # 1. Generate timestamp
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    # 2. Get access token
    auth_response = requests.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        auth=(settings.MPESA_CONSUMER_KEY, settings.MPESA_CONSUMER_SECRET)
    )
    access_token = auth_response.json()['access_token']

    # 3. STK Push request
    stk_payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password": settings.MPESA_PASSWORD,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,
        "PartyB": settings.MPESA_SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": settings.MPESA_CALLBACK_URL,
        "AccountReference": "RentMe",
        "TransactionDesc": "Payment for RentMe"
    }

    response = requests.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        json=stk_payload,
        headers={'Authorization': f'Bearer {access_token}'}
    )

    return JsonResponse(response.json())


@api_view(['POST'])
def mpesa_callback(request):
    print("M-Pesa Callback:", request.data)
    return JsonResponse({"message": "Callback received"})
