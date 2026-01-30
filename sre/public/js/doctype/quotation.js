frappe.ui.form.on('Quotation', {
    refresh: function(frm) {
        if (frm.doc.status === 'Open') {
            frm.add_custom_button(__('Project Proposal'), function() {
                let new_doc = frappe.model.get_new_doc('Project Proposal');
                frappe.model.set_value('Project Proposal', new_doc.name, 'customer', frm.doc.party_name || frm.doc.customer);
                frappe.model.set_value('Project Proposal', new_doc.name, 'project_name', frm.doc.project_name || frm.doc.name);
                frappe.model.set_value('Project Proposal', new_doc.name, 'company', frm.doc.company);
                frappe.model.set_value('Project Proposal', new_doc.name, 'currency', frm.doc.currency);
                new_doc.items = [];
                if (frm.doc.items && frm.doc.items.length > 0) {
                    frm.doc.items.forEach(source_row => {
                        let target_row = frappe.model.add_child(new_doc, 'Project Proposal Item', 'items');

                        target_row.item          = source_row.item_code;
                        target_row.description   = source_row.description;
                        target_row.qty           = source_row.qty;
                        target_row.uom           = source_row.uom;
                        target_row.cost_per_watt = flt(source_row.rate) || flt(source_row.base_rate) || 0;
                        target_row.amount        = flt(source_row.amount) || (flt(source_row.qty) * flt(source_row.rate || 0));
                    });

                    frappe.model.set_value('Project Proposal', new_doc.name, 'items', new_doc.items);
                }

                frappe.set_route('Form', 'Project Proposal', new_doc.name);
            }, __('Create'));
        }
    },

    retention_profit_rate: function(frm) {
        (frm.doc.items || []).forEach(item => {
            frappe.model.set_value(item.doctype, item.name, 'retention_profit_rate', frm.doc.retention_profit_rate);
        });
    }
});
frappe.ui.form.on('Quotation Item', {
    item_code: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (row.item_code) {
            frappe.call({
                method: 'erpnext.stock.get_item_details.get_valuation_rate',
                args: {
                    item_code: row.item_code,
                    company: frm.doc.company,
                },
                callback: function(r) {
                    if (r.message && r.message.valuation_rate) {
                        let rate = flt(r.message.valuation_rate);
                        frappe.model.set_value(cdt, cdn, 'rate', rate);
                        frappe.model.set_value(cdt, cdn, 'base_rate', rate);
                    }
                }
            });
        }
    },

    items_add: function(frm, cdt, cdn) {
        if (frm.doc.retention_profit_rate) {
            frappe.model.set_value(cdt, cdn, 'retention_profit_rate', frm.doc.retention_profit_rate);
        }
    }
});
frappe.ui.form.on('Project Proposal', {
    refresh: function(frm) {
        calculate_grand_total(frm);  
    },
    items_add: function(frm) {
        calculate_grand_total(frm);
    },
    items_remove: function(frm) {
        calculate_grand_total(frm);
    }
});

frappe.ui.form.on('Project Proposal Item', {
    qty: function(frm, cdt, cdn) {
        update_row_amount(cdt, cdn);
        calculate_grand_total(frm);
    },
    cost_per_watt: function(frm, cdt, cdn) {
        update_row_amount(cdt, cdn);
        calculate_grand_total(frm);
    },
    amount: function(frm, cdt, cdn) {
        calculate_grand_total(frm);
    }
});
function update_row_amount(cdt, cdn) {
    let row = locals[cdt][cdn];
    if (flt(row.qty) > 0 && flt(row.cost_per_watt) > 0) {
        let amount = flt(row.qty) * flt(row.cost_per_watt);
        frappe.model.set_value(cdt, cdn, 'amount', amount);
    }
}
function calculate_grand_total(frm) {
    let total = 0;
    (frm.doc.items || []).forEach(row => {
        total += flt(row.amount) || 0;
    });

    frm.set_value('grand_total', total);
    frm.refresh_field('grand_total');
}