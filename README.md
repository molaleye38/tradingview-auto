# TradingView Auto (Render-ready)

This project logs in to TradingView, scrapes bullish/bearish screeners for stocks and crypto (top 10 rows each), and sends formatted messages to Telegram.

### Render Setup
1. Push this repo to GitHub.
2. Go to Render → “New” → “Cron Job”.
3. Connect this repo.
4. Add these 2 jobs:

**Stocks job (Mon–Fri 16:10 WAT)**  
Command:
