frappe.ui.form.on('Lead', {
    refresh: function(frm) {
        if (!frm.is_new()) {
            frm.add_custom_button(__('Project Proposal'), function() {
                frappe.new_doc('Project Proposal', {
                    company_name: frm.doc.lead_name
                });
            }, __('Create'));
        }
    }
})