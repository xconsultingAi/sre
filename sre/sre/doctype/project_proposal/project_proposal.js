// Copyright (c) 2025, ashuar and contributors
// For license information, please see license.txt

frappe.ui.form.on("Project Proposal", {
	template: function (frm) {
		if (!frm.doc.template) return;

		frappe.call({
			method: "sre.api.map_from_template",
			args: {
				template_name: frm.doc.template,
				target_doc: frm.doc
			},
			callback: function (r) {
				if (!r.message) return;

				frm.clear_table();
				frappe.model.sync(r.message);
				frm.refresh();
			}
		});
	},
});
