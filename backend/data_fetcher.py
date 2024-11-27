import yfinance as yf
from flask import jsonify

def fetch_stock_data():
    stocks = ['AAPL', 'GOOG', 'TSLA']  # Replace with stocks of interest
    data = yf.download(stocks, period='1mo')

    # Convert index (timestamps) to strings for JSON serialization
    dates = data.index.strftime('%Y-%m-%d').tolist()

    # Restructure prices by stock
    prices = {stock: data['Close'][stock].tolist() for stock in stocks}

    return {
        "dates": dates,
        "prices": prices  # Return prices indexed by stock
    }

def get_stock_data_api():
    stock_data = fetch_stock_data()
    return jsonify(stock_data)
