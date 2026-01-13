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
        if (row.item_code) {
            frappe.call({
                method: 'erpnext.stock.get_item_details.get_valuation_rate',
                args: {
                    item_code: row.item_code,
                    company: frm.doc.company
                },
                callback: function (r) {
                    if (r.message) {
                        frappe.model.set_value(cdt, cdn, 'rate', r.message.valuation_rate);
                        // frappe.model.set_value(cdt, cdn, 'base_rate', r.message.valuation_rate);
                        // frappe.model.set_value(cdt, cdn, 'base_price', r.message.valuation_rate);
                    }
                }
            });
        }
    },

});