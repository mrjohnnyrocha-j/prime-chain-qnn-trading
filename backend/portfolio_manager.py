def manage_portfolio(user_preferences, real_time_data):
    portfolio_decisions = {}
    for stock, data in real_time_data.items():
        if data['price'] < user_preferences.get('max_price', float('inf')):
            portfolio_decisions[stock] = "Buy"
        else:
            portfolio_decisions[stock] = "Hold"
    return portfolio_decisions
