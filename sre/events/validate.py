def validate_quotation(doc, method):
    costing_amount = 0
    profit_amount = 0
    total_amount = 0
    rate = 0
    for item in doc.items:
        costing_amount += item.qty * item.rate
        profit_amount += item.gross_profit
       
        if not item.base_price or item.base_price == 0:
            item.base_price = item.rate

        item.rate = item.rate * (1 + (item.retention_profit_rate or 0) / 100)
        item.amount = item.qty * item.rate
        total_amount += item.amount
        
    doc.costing_amount = costing_amount
    doc.profit_amount = profit_amount
    doc.total = total_amount



