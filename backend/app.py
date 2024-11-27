from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
from data_fetcher import get_stock_data_api  # Assumed to fetch stock data
from flask_cors import CORS
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from chatbot import Chatbot

app = Flask(__name__)
CORS(app)  # Enable CORS for the Flask app
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow WebSocket from any origin

chatbot = Chatbot()

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message')
def handle_message(message):
    response = chatbot.get_response(message)
    send(response, broadcast=True)

portfolio = {}  # This will store the user's stock portfolio as {'stock': shares}

@socketio.on('buyStock')
def handle_buy_stock(data):
    try:
        stock = data.get('stock')
        shares = int(data.get('shares'))
        
        if not stock or shares <= 0:
            raise ValueError('Invalid stock or shares.')

        if stock in portfolio:
            portfolio[stock] += shares
        else:
            portfolio[stock] = shares

        emit('transactionResult', {'status': 'success', 'action': 'buy', 'stock': stock, 'shares': shares, 'portfolio': portfolio})
    except Exception as e:
        emit('transactionResult', {'status': 'failure', 'message': str(e)})

@socketio.on('sellStock')
def handle_sell_stock(data):
    try:
        stock = data.get('stock')
        shares = int(data.get('shares'))
        
        if not stock or shares <= 0:
            raise ValueError('Invalid stock or shares.')
        
        if stock not in portfolio or portfolio[stock] < shares:
            raise ValueError('Not enough shares to sell.')

        portfolio[stock] -= shares

        if portfolio[stock] == 0:
            del portfolio[stock]

        emit('transactionResult', {'status': 'success', 'action': 'sell', 'stock': stock, 'shares': shares, 'portfolio': portfolio})
    except Exception as e:
        emit('transactionResult', {'status': 'failure', 'message': str(e)})

@socketio.on('doubleStock')
def handle_double_stock(data):
    try:
        stock = data.get('stock')
        
        if not stock or stock not in portfolio:
            raise ValueError('You do not own this stock.')

        portfolio[stock] *= 2

        emit('transactionResult', {'status': 'success', 'action': 'double', 'stock': stock, 'portfolio': portfolio})
    except Exception as e:
        emit('transactionResult', {'status': 'failure', 'message': str(e)})

@socketio.on('multiplyStock')
def handle_multiply_stock(data):
    try:
        stock = data.get('stock')
        multiplier = float(data.get('multiplier'))

        if not stock or stock not in portfolio or multiplier <= 0:
            raise ValueError('Invalid stock or multiplier.')

        portfolio[stock] = int(portfolio[stock] * multiplier)

        emit('transactionResult', {'status': 'success', 'action': 'multiply', 'stock': stock, 'portfolio': portfolio})
    except Exception as e:
        emit('transactionResult', {'status': 'failure', 'message': str(e)})

@app.route('/market-data', methods=['GET'])
def market_data():
    return get_stock_data_api()

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5001)
