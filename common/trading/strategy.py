from models.quantum_neural_network import QuantumNeuralNetwork
import yfinance as yf

class TradingStrategy:
    def __init__(self):
        self.qnn = QuantumNeuralNetwork()

    def execute_strategy(self, stock_symbols):
        data = yf.download(stock_symbols, period='1mo')
        allocation = self.qnn.predict(data.values)
        return allocation
