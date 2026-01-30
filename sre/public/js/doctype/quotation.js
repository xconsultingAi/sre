frappe.ui.form.on('Quotation', {
    refresh: function (frm) {
        frm.add_custom_button(__('Project Propsal'), function () {
            frappe.new_doc('Project Proposal', {
                ...frm.doc
            });
        }, __('Create'));
    },

    retention_profit_rate: function (frm) {
        frm.doc.items.forEach(item => {
            item.retention_profit_rate = frm.doc.retention_profit_rate;
            frm.refresh_field('items');
        })
    },
});


frappe.ui.form.on('Quotation Item', {
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
                        debugger
                        frappe.model.set_value(cdt, cdn, 'rate', r.message.valuation_rate);
                        frappe.model.set_value(cdt, cdn, 'base_rate', r.message.valuation_rate);
                        frappe.model.set_value(cdt, cdn, 'base_price', r.message.valuation_rate);
                    }
                }
            });
        }
    },

    items_add: function (frm, cdt, cdn) {
        if (frm.doc.retention_profit_rate) {
            debugger
            frappe.model.set_value(cdt, cdn, 'retention_profit_rate', frm.doc.retention_profit_rate);
        }
    }
});