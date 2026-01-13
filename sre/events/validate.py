def validate_quotation(doc, method):
    costing_amount = 0
    profit_amount = 0
    rate = 0
    for item in doc.items:
        costing_amount += item.qty * item.valuation_rate
        profit_amount += item.gross_profit
        # Protect original rate
        if not item.base_price or item.base_price == 0:
            item.base_price = item.rate

        # Calculate margin only from original
        item.rate = item.base_price * (1 + (item.retention_profit_rate or 0) / 100)
        item.amount = item.qty * item.rate

    doc.costing_amount = costing_amount
    doc.profit_amount = profit_amount



