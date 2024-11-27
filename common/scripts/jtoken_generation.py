import web3
from web3 import Web3

class JTokenGenerator:
    def __init__(self, provider_url, contract_address, abi):
        self.web3 = Web3(Web3.HTTPProvider(provider_url))
        self.contract = self.web3.eth.contract(address=contract_address, abi=abi)

    def mint_tokens(self, amount, account, private_key):
        tx = self.contract.functions.mint(amount).buildTransaction({
            'from': account,
            'nonce': self.web3.eth.getTransactionCount(account)
        })
        signed_tx = self.web3.eth.account.signTransaction(tx, private_key)
        tx_hash = self.web3.eth.sendRawTransaction(signed_tx.rawTransaction)
        return tx_hash.hex()
