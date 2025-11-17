def validate_quotation(doc, method):
    costing_amount = 0
    profit_amount = 0
    for item in doc.items:
        costing_amount += item.qty * item.valuation_rate
        profit_amount += item.gross_profit

    doc.costing_amount = costing_amount
    doc.profit_amount = profit_amount
