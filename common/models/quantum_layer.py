import numpy as np
from qubit import Qubit, hadamard, pauli_x

class QuantumLayer:
    def __init__(self, num_qubits):
        self.num_qubits = num_qubits
        self.qubits = [Qubit() for _ in range(num_qubits)]

    def apply_hadamard_layer(self):
        """Apply the Hadamard gate to all qubits in the layer."""
        for qubit in self.qubits:
            qubit.apply_gate(hadamard())

    def apply_pauli_x_layer(self):
        """Apply the Pauli-X gate to all qubits in the layer."""
        for qubit in self.qubits:
            qubit.apply_gate(pauli_x())

    def measure_layer(self):
        """Measure all qubits in the layer."""
        measurements = [qubit.measure() for qubit in self.qubits]
        return measurements

    def reset_layer(self):
        """Reset all qubits in the layer."""
        for qubit in self.qubits:
            qubit.reset()

# Example of using the QuantumLayer
if __name__ == '__main__':
    layer = QuantumLayer(num_qubits=3)
    layer.apply_hadamard_layer()
    measurements = layer.measure_layer()
    print(f"Qubit measurements: {measurements}")
