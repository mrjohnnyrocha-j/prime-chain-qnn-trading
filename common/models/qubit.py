import numpy as np

class Qubit:
    def __init__(self):
        self.state = np.array([1, 0])  # Initialize qubit in |0> state (basis vector [1, 0])

    def apply_gate(self, gate):
        """Apply a quantum gate to the qubit state."""
        self.state = np.dot(gate, self.state)

    def measure(self):
        """Measure the qubit state in the computational basis."""
        probabilities = np.abs(self.state) ** 2
        result = np.random.choice([0, 1], p=probabilities)
        return result

    def reset(self):
        """Reset the qubit to the initial state |0>."""
        self.state = np.array([1, 0])

# Example of a Pauli-X gate (quantum NOT gate)
def pauli_x():
    return np.array([[0, 1], [1, 0]])

# Example of a Hadamard gate
def hadamard():
    return (1 / np.sqrt(2)) * np.array([[1, 1], [1, -1]])

# Add more gates as needed.
