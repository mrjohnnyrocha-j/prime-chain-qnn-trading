import requests

class StablecoinPegging:
    def __init__(self, stablecoin_contract, oracle_address):
        self.stablecoin_contract = stablecoin_contract
        self.oracle_address = oracle_address

    def get_current_price(self):
        response = requests.get(f'https://oracle.api/price/{self.oracle_address}')
        return response.json()['price']

    def adjust_stablecoin_supply(self, current_price, target_price):
        if current_price > target_price:
            self.stablecoin_contract.burn(current_price - target_price)
        else:
            self.stablecoin_contract.mint(target_price - current_price)
