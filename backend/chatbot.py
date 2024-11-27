import yfinance as yf
from models.quantum_neural_network import PrimeChainQuantumNeuralNetwork
from models.nlp_model import PrimeChainNLP

class Chatbot:
    def __init__(self):
        self.qnn = PrimeChainQuantumNeuralNetwork()
        self.nlp_model = PrimeChainNLP()
        self.previous_context = None

    def get_response(self, message, market_data=None):
        if "market data" in message.lower():
            return self.get_market_data()
        elif "optimize portfolio" in message.lower():
            return self.optimize_portfolio()
        else:
            response = self.nlp_model.generate_response(message, self.previous_context, market_data)
            self.previous_context = self.nlp_model.forward(message)
            return response

    def get_market_data(self):
        stocks = ['AAPL', 'GOOG', 'TSLA']
        data = yf.download(stocks, period='1d')
        return data.tail().to_string()

    def optimize_portfolio(self):
        stocks = ['AAPL', 'GOOG', 'TSLA']
        data = yf.download(stocks, period='1mo')
        close_prices = data['Close'].values
        portfolio_suggestion = self.qnn.predict(close_prices[-1])
        return f"Suggested portfolio allocation for (AAPL, GOOG, TSLA): {portfolio_suggestion}"
