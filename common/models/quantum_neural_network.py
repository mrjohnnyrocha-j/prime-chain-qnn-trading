import numpy as np

class PrimeChainQuantumNeuralNetwork:
    def __init__(self, num_qubits=3, num_layers=2):
        self.num_qubits = num_qubits
        self.num_layers = num_layers
        self.weights = np.random.rand(num_layers, num_qubits)

    def forward(self, data):
        # Use prime-based modulation for enhanced quantum state evolution
        prime_gaps = self._calculate_prime_gaps(self.num_qubits)
        quantum_state = np.zeros(self.num_qubits)

        for layer in range(self.num_layers):
            for qubit in range(self.num_qubits):
                modulation = np.sin(self.weights[layer][qubit] * prime_gaps[qubit] * data[qubit])
                quantum_state[qubit] += modulation

                # Enhance with multi-level modulation for deeper layers
                if layer > 0:
                    quantum_state[qubit] *= np.cos(self.weights[layer - 1][qubit] * data[qubit])

        return quantum_state

    def predict(self, data):
        # Use forward propagation for portfolio optimization
        quantum_state = self.forward(data)
        probabilities = np.tanh(quantum_state)
        return probabilities

    def _calculate_prime_gaps(self, num_qubits):
        primes = self._generate_primes(num_qubits * 10)
        prime_gaps = [primes[i] - primes[i - 1] for i in range(1, len(primes))]
        return prime_gaps[:num_qubits]

    def _generate_primes(self, limit):
        primes = []
        for num in range(2, limit):
            is_prime = all(num % i != 0 for i in range(2, int(np.sqrt(num)) + 1))
            if is_prime:
                primes.append(num)
        return primes
