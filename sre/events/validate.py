def validate_quotation(doc, method):
    costing_amount = 0
    profit_amount = 0
    total_amount = 0

    for item in doc.items:
        costing_amount += item.qty * item.rate
        profit_amount += item.gross_profit or 0

        # Preserve original rate if needed
        if not item.base_price or item.base_price == 0:
            item.base_price = item.rate

        retention_rate = (item.retention_profit_rate or 0) / 100
        adjusted_rate = item.rate * (1 + retention_rate)

        item.rate = adjusted_rate
        item.base_rate = adjusted_rate
        item.net_rate = adjusted_rate
        item.base_net_rate = adjusted_rate

        item.amount = item.qty * adjusted_rate
        item.base_amount = item.qty * adjusted_rate
        item.base_net_amount = item.qty * adjusted_rate
        item.net_amount = item.qty * adjusted_rate

        total_amount += item.amount

    doc.costing_amount = costing_amount
    doc.profit_amount = profit_amount
    doc.total = total_amount