import numpy as np
from models.quantum_neural_network import PrimeChainQuantumNeuralNetwork
from sklearn.feature_extraction.text import TfidfVectorizer

class PrimeChainNLP:
    def __init__(self, vocab_size=10000, embedding_dim=256, num_qubits=3, num_layers=2):
        self.qnn = PrimeChainQuantumNeuralNetwork(num_qubits=num_qubits, num_layers=num_layers)
        self.vocab_size = vocab_size
        self.embedding_dim = embedding_dim
        self.embedding_weights = np.random.rand(vocab_size, embedding_dim)
        self.tfidf_vectorizer = TfidfVectorizer(max_features=vocab_size)

    def tokenize(self, sentence):
        return sentence.lower().split()

    def word_to_index(self, word):
        return hash(word) % self.vocab_size

    def get_embedding(self, sentence):
        tokens = self.tokenize(sentence)
        embeddings = np.array([self.embedding_weights[self.word_to_index(word)] for word in tokens])
        return embeddings

    def forward(self, sentence, previous_context=None, market_data=None):
        embeddings = self.get_embedding(sentence)
        sentence_vector = np.mean(embeddings, axis=0)

        # If market data is provided, adjust embeddings based on stock price trends
        if market_data is not None:
            sentence_vector = self._adjust_for_market_data(sentence_vector, market_data)

        prime_gaps = self._calculate_prime_gaps(len(sentence_vector))
        adjusted_sentence_vector = self._apply_prime_attention(sentence_vector, prime_gaps)

        if previous_context is not None:
            if previous_context.shape != sentence_vector.shape:
                previous_context = np.resize(previous_context, sentence_vector.shape)
            sentence_vector += np.sin(previous_context)

        encoded_sentence = self.qnn.forward(adjusted_sentence_vector)
        return encoded_sentence

    def _adjust_for_market_data(self, sentence_vector, market_data):
        # Modify sentence vector based on recent market trends (example: stock price change)
        market_trend_influence = np.tanh(np.mean(list(market_data.values())))  # Market trend influence
        sentence_vector *= (1 + market_trend_influence)
        return sentence_vector

    def generate_response(self, sentence, previous_context=None, market_data=None):
        encoded_sentence = self.forward(sentence, previous_context, market_data)
        response_vector = np.tanh(encoded_sentence)
        response = self._dummy_decoder(response_vector)
        return response

    def _calculate_prime_gaps(self, vector_length):
        primes = self._generate_primes(vector_length * 10)
        prime_gaps = [primes[i] - primes[i - 1] for i in range(1, len(primes))]
        return prime_gaps[:vector_length]

    def _apply_prime_attention(self, vector, prime_gaps):
        attention_weights = np.tanh(prime_gaps)
        return vector * attention_weights

    def _generate_primes(self, limit):
        primes = []
        for num in range(2, limit):
            is_prime = all(num % i != 0 for i in range(2, int(np.sqrt(num)) + 1))
            if is_prime:
                primes.append(num)
        return primes

    def _dummy_decoder(self, vector):
        words = ['quantum', 'neural', 'network', 'response', 'prime']
        return " ".join(np.random.choice(words, size=len(words)))
