# zettle-washere-gateway
# Zettle → WasHere Gateway

یک فانکشن سرورلس خیلی ساده برای اتصال صندوق Zettle به Webhook سیستم وفاداری WasHere.
هر پرداخت که در Zettle ثبت شود، به WasHere POST می‌شود تا امتیاز/اکشن اجرا شود.

## دیپلوی سریع روی Vercel
1) این ریپو را روی GitHub خودت آپلود کن.
2) در Vercel روی "New Project" بزن و همین ریپو را ایمپورت کن.
3) Environment Variables را ست کن:
   - `WASHERE_WEBHOOK_URL` = آدرس وب‌هوک WasHere (از داخل WasHere کپی کن)
   - `WEBHOOK_TOKEN` = یک رشتهٔ محرمانه (مثلاً: `p3yA9...`).

4) Deploy کن. آدرس فانکشن چیزی مثل این می‌شود:
   `https://YOUR-APP.vercel.app/api/zettle-webhook`

5) در Zettle، وبهوک خرید را به این URL وصل کن و **token** را به انتهای URL اضافه کن:
   `https://YOUR-APP.vercel.app/api/zettle-webhook?token=YOUR_SECRET_TOKEN`

   > این توکن برای این است که فقط درخواست‌های معتبر را قبول کنیم.

## تست دستی
```bash
curl -X POST "https://YOUR-APP.vercel.app/api/zettle-webhook?token=YOUR_SECRET_TOKEN"       -H "Content-Type: application/json"       -d '{"amount":{"amount":12000,"currencyId":"SEK"},"purchaseUUID":"test-123","timestamp":"2025-08-17T15:40:00Z"}'
```

اگر WasHere 200 بدهد، پاسخ این فانکشن هم ok:true خواهد بود.

## نکته
- اگر نام فیلدهای Zettle در بدنه با نمونه فرق داشت، داخل کد جاهای `amount/currency/purchaseUUID/...` را با نام‌های واقعی عوض کن.
- امنیت بیشتر: در Zettle اگر امکان امضای HMAC داشته باشی، می‌توانی به‌جای کوئری توکن از امضای هدر استفاده کنی (در این نسخه برای سادگی حذف شده است).
