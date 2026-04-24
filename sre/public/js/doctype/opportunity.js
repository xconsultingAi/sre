frappe.ui.form.on('Opportunity', {
    retention_profit_rate: function (frm) {
        frm.doc.items.forEach(item => {
            item.retention_profit_rate = frm.doc.retention_profit_rate;
            frm.refresh_field('items');
        })
    },
});
frappe.ui.form.on('Opportunity Item', {
    item_code: function (frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (!row.item_code) return;
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Stock Ledger Entry',
                filters: {
                    item_code: row.item_code,
                    company: frm.doc.company,
                    is_cancelled: 0
                },
                fields: ['valuation_rate'],
                order_by: 'posting_date desc, posting_time desc',
                limit: 1
            },
            callback: function (r) {
                let rate = flt(r?.message?.[0]?.valuation_rate) || 0;

                if (rate > 0) {
                    console.log('Valuation Rate from Stock Ledger:', rate);
                    set_rate_values(cdt, cdn, rate);
                } else {
                    frappe.call({
                        method: 'frappe.client.get_value',
                        args: {
                            doctype: 'Item',
                            fieldname: 'valuation_rate',
                            filters: { name: row.item_code }
                        },
                        callback: function (item_r) {
                            let fallback_rate = flt(item_r?.message?.valuation_rate) || 0;
                            console.log('Valuation Rate from Item Master:', fallback_rate);
                            set_rate_values(cdt, cdn, fallback_rate);
                        }
                    });
                }
            }
        });
        frappe.call({
            method: 'sre.api.get_company_total_stock',
            args: {
                item_code: row.item_code,
                company: frm.doc.company
            },
            callback: function (r) {
                let stock = r.message ?? 0;
                frappe.model.set_value(cdt, cdn, 'company_stock', stock);
            }
        });
    }
});
function set_rate_values(cdt, cdn, rate) {
    frappe.model.set_value(cdt, cdn, 'rate', rate);
    frappe.model.set_value(cdt, cdn, 'base_price', rate);
}
