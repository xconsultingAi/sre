// Copyright (c) 2024, Your Company and contributors
// For license information, please see license.txt

frappe.query_reports["Purchase Order Summary Date Wise"] = {
    "filters": [
        {
            "fieldname": "from_date",
            "label": __("From Date"),
            "fieldtype": "Date",
            "default": frappe.datetime.add_months(frappe.datetime.get_today(), -1),
            "reqd": 0
        },
        {
            "fieldname": "to_date",
            "label": __("To Date"),
            "fieldtype": "Date",
            "default": frappe.datetime.get_today(),
            "reqd": 0
        },
        {
            "fieldname": "supplier",
            "label": __("Supplier"),
            "fieldtype": "Link",
            "options": "Supplier",
            "reqd": 0
        },
        {
            "fieldname": "cost_center",
            "label": __("Cost Center"),
            "fieldtype": "Link",
            "options": "Cost Center",
            "reqd": 0
        },
        {
            "fieldname": "item_code",
            "label": __("Item Code"),
            "fieldtype": "Link",
            "options": "Item",
            "reqd": 0
        },
        {
            "fieldname": "purchase_order",
            "label": __("Purchase Order"),
            "fieldtype": "Link",
            "options": "Purchase Order",
            "reqd": 0
        }
    ],

    "formatter": function(value, row, column, data, default_formatter) {
        value = default_formatter(value, row, column, data);
        
        // Highlight rows with high consumption
        if (column.fieldname == "consumption_1_month" && data && data.consumption_1_month > 20) {
            value = "<span style='color: red; font-weight: bold;'>" + value + "</span>";
        }
        
        // Highlight low stock items
        if (column.fieldname == "qty_on_hand" && data && data.qty_on_hand <= 0) {
            value = "<span style='color: orange; font-weight: bold;'>" + value + "</span>";
        }
        
        return value;
    },

    "onload": function(report) {
        // Add summary cards at top
        report.page.add_inner_button(__("Export to Excel"), function() {
            frappe.query_report.export_excel();
        });
    }
};