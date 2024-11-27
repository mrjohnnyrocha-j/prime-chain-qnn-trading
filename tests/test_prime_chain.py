import unittest
from models.quantum_neural_network import QuantumNeuralNetwork

class TestPrimeChain(unittest.TestCase):
    def test_qnn_prediction(self):
        qnn = QuantumNeuralNetwork()
        data = [[1, 2, 3]]
        result = qnn.predict(data)
        self.assertEqual(len(result), 3)  # Ensure it returns expected length

if __name__ == '__main__':
    unittest.main()
