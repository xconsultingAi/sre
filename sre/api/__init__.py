import frappe
from frappe.model.mapper import get_mapped_doc


@frappe.whitelist()
def map_from_template(template_name, target_doc=None):
    doc = get_mapped_doc(
        "Project Proposal Template",
        template_name,
        {
            "Project Proposal Template": {
                "doctype": "Project Proposal",
                "field_map": {},
            },
            "Quarter Energy Gain": {
                "doctype": "Quarter Energy Gain",
                "field_map": {},
            },
            "Quarter Cost Saving": {
                "doctype": "Quarter Cost Saving",
                "field_map": {},
            },
            "Project Proposal Item": {
                "doctype": "Project Proposal Item",
                "field_map": {
                    "item_code": "item_code",
                    "item_name": "item_name",
                    "description": "description",
                    "qty": "qty",
                    "uom": "uom",
                    "rate": "rate",
                    "amount": "amount",
                },
                "filters": {
                    "parenttype": "Project Proposal Template",
                }
            },
        },
        target_doc,
    )

    return doc


@frappe.whitelist()
def get_company_total_stock(item_code, company):
    from erpnext.stock.get_item_details import get_company_total_stock as get_total_stock
    return get_total_stock(item_code, company)