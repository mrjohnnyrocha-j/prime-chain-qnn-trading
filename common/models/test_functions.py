import numpy as np

def polynomial_decay(x, gamma):
    """Polynomial decay function h(x) = |x|^-gamma."""
    return np.abs(x) ** -gamma

def sigmoid(x):
    """Sigmoid activation function."""
    return 1 / (1 + np.exp(-x))

def relu(x):
    """ReLU activation function."""
    return np.maximum(0, x)

def mean_squared_error(predictions, targets):
    """Mean Squared Error loss function."""
    return np.mean((predictions - targets) ** 2)

def cross_entropy_loss(predictions, targets):
    """Cross-Entropy loss function."""
    epsilon = 1e-10
    return -np.sum(targets * np.log(predictions + epsilon))

# Add more test functions or mathematical utilities as needed.
