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
                callback: function(r) {
                    let rate = 0;
                    
                    
                    if (r.message && r.message.valuation_rate) {
                        rate = flt(r.message.valuation_rate);
                    }
                    
   
                    if (!rate || rate === 0) {
                        frappe.call({
                            method: 'frappe.client.get_value',
                            args: {
                                doctype: 'Item',
                                fieldname: 'valuation_rate',
                                filters: { name: row.item_code }
                            },
                            callback: function(item_r) {
                                if (item_r.message && item_r.message.valuation_rate) {
                                    rate = flt(item_r.message.valuation_rate);
                                }
                                
                                // Set values after fallback check
                                frappe.model.set_value(cdt, cdn, 'rate', rate);
                                frappe.model.set_value(cdt, cdn, 'base_price', rate);
                            }
                        });
                    } else {
                  
                        frappe.model.set_value(cdt, cdn, 'rate', rate);
                        frappe.model.set_value(cdt, cdn, 'base_price', rate);
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
                    if (r.message !== undefined && r.message !== null) {
                        frappe.model.set_value(cdt, cdn, 'company_stock', r.message);
                    }
                }
            });
        }
    }
});