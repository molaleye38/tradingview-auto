# TradingView Auto (Render-ready)

This project logs in to TradingView, scrapes bullish/bearish screeners for stocks and crypto (top 10 rows each), and sends a formatted Markdown message to Telegram.

## Quick steps to deploy on Render
1. Push this repo to GitHub (do not include real .env).
2. In Render, create two Cron Jobs:
   - Stocks (Weekdays 16:10 WAT): 
     Command:
     node -e "import('./main.js').then(m => m.runAutomation({type:'stock'}))"
     Schedule (UTC): 23 15 * * 1-5
   - Crypto (Daily 23:00 WAT):
     Command:
     node -e "import('./main.js').then(m => m.runAutomation({type:'crypto'}))"
     Schedule (UTC): 0 22 * * *
3. Add environment variables in Render (same keys as .env.example).
4. Test one job. Check Telegram.

