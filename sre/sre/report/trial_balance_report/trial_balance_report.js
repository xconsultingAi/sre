frappe.query_reports["Trial Balance Report"] = {
	"filters": [
		{
			"fieldname": "company",
			"label": __("Company"),
			"fieldtype": "Link",
			"options": "Company",
			"default": frappe.defaults.get_user_default("Company"),
			"reqd": 1
		},
		{
			"fieldname": "fiscal_year",
			"label": __("Fiscal Year"),
			"fieldtype": "Link",
			"options": "Fiscal Year",
			"default": frappe.sys_defaults.fiscal_year,
			"reqd": 1,
			"on_change": function(query_report) {
				let fiscal_year = query_report.get_values().fiscal_year;
				if (!fiscal_year) return;

				frappe.model.with_doc("Fiscal Year", fiscal_year, function() {
					let fy = frappe.model.get_doc("Fiscal Year", fiscal_year);
					frappe.query_report.set_filter_value({
						from_date: fy.year_start_date,
						to_date: fy.year_end_date
					});
				});
			}
		},
		{
			"fieldname": "from_date",
			"label": __("From Date"),
			"fieldtype": "Date",
			"default": frappe.datetime.add_months(frappe.datetime.get_today(), -1),
			"reqd": 1
		},
		{
			"fieldname": "to_date",
			"label": __("To Date"),
			"fieldtype": "Date",
			"default": frappe.datetime.get_today(),
			"reqd": 1
		},
		{
			"fieldname": "account_levels",
			"label": __("Account Levels"),
			"fieldtype": "MultiSelectList",
			"get_data": function() {
				return [1,2,3,4,5].map(i => ({
					value: i,
					description: `Level ${i}`
				}));
			}
		},
		{
			"fieldname": "finance_book",
			"label": __("Finance Book"),
			"fieldtype": "Link",
			"options": "Finance Book"
		},
		{
			"fieldname": "cost_center",
			"label": __("Cost Center"),
			"fieldtype": "Link",
			"options": "Cost Center",
			"get_query": () => ({
				filters: {
					company: frappe.query_report.get_filter_value("company")
				}
			})
		},
		{
			"fieldname": "project",
			"label": __("Project"),
			"fieldtype": "MultiSelectList",
			"get_data": txt => frappe.db.get_link_options("Project", txt)
		},
		{
			"fieldname": "presentation_currency",
			"label": __("Currency"),
			"fieldtype": "Link",
			"options": "Currency"
		},
		{"fieldname": "show_zero_values","label": __("Show zero values"),"fieldtype": "Check"},
		{"fieldname": "show_net_values","label": __("Show Net Values"),"fieldtype": "Check"},
		{"fieldname": "show_group_accounts","label": __("Show Group Accounts"),"fieldtype": "Check","default": 1},
		{"fieldname": "include_default_book_entries","label": __("Include Default FB Entries"),"fieldtype": "Check","default": 1},
		{"fieldname": "show_unclosed_fy_pl_balances","label": __("Show Unclosed FY P&L Balances"),"fieldtype": "Check"},
		{"fieldname": "with_period_closing_entry_for_opening","label": __("Opening with Period Closing Entry"),"fieldtype": "Check"},
		{"fieldname": "with_period_closing_entry_for_current_period","label": __("Current Period with Period Closing Entry"),"fieldtype": "Check"}
	],

	// ✅ FIXED FORMATTER
	"formatter": function(value, row, column, data, default_formatter) {
		value = default_formatter(value, row, column, data);

		if (column.fieldname === "account") {
			value = `<b>${value}</b>`;
		}

		return value;
	},

	"onload": function(report) {
		let fiscal_year = frappe.defaults.get_user_default("fiscal_year");
		if (fiscal_year) {
			frappe.model.with_doc("Fiscal Year", fiscal_year, function() {
				let fy = frappe.model.get_doc("Fiscal Year", fiscal_year);
				frappe.query_report.set_filter_value({
					from_date: fy.year_start_date,
					to_date: fy.year_end_date
				});
			});
		}
	}
};