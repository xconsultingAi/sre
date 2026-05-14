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
        const items = frm.doc.items || [];
        const firstRate = items.length ? flt(items[0].rate) : 0;

        items.forEach(item => {

            if (item.retention_profit_rate && item.retention_profit_rate !== 0) {
                return;
            }

            if (!frm.doc.retention_profit_rate || frm.doc.retention_profit_rate === 0) {
                const rateToUse = firstRate;
                frappe.model.set_value(item.doctype, item.name, 'rate', rateToUse);
                frappe.model.set_value(item.doctype, item.name, 'amount', flt(item.qty) * rateToUse);
                frappe.model.set_value(item.doctype, item.name, 'net_amount', flt(item.qty) * rateToUse);
                frappe.model.set_value(item.doctype, item.name, 'retention_profit_rate', 0);
            } else {
                const retentionRate = flt(frm.doc.retention_profit_rate) || 0;
                const originalRate = flt(item.rate) || 0;
                const adjustedRate = originalRate * (1 + retentionRate / 100);
                frappe.model.set_value(item.doctype, item.name, 'retention_profit_rate', frm.doc.retention_profit_rate);
                frappe.model.set_value(item.doctype, item.name, 'rate', adjustedRate);
                frappe.model.set_value(item.doctype, item.name, 'amount', flt(item.qty) * adjustedRate);
                frappe.model.set_value(item.doctype, item.name, 'net_amount', flt(item.qty) * adjustedRate);
            }
        });
        calculate_grand_total(frm);
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

frappe.ui.form.on('Quotation Item', {
    retention_profit_rate: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        let retentionRate = flt(row.retention_profit_rate) || 0;
        let originalRate = flt(row.rate) || 0;
        let adjustedRate = originalRate * (1 + retentionRate / 100);
        frappe.model.set_value(cdt, cdn, 'rate', adjustedRate);
        frappe.model.set_value(cdt, cdn, 'base_rate', adjustedRate);
        frappe.model.set_value(cdt, cdn, 'base_net_rate', adjustedRate);
        frappe.model.set_value(cdt, cdn, 'amount', flt(row.qty) * adjustedRate);
        frappe.model.set_value(cdt, cdn, 'base_price', adjustedRate);
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
