# Copyright (c) 2024, Your Company and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.utils import flt


def execute(filters=None):
    if not filters:
        filters = {}

    columns = get_columns()
    data = get_data(filters)

    return columns, data


def get_columns():
    return [
        {
            "fieldname": "po_number",
            "label": _("PO #"),
            "fieldtype": "Link",
            "options": "Purchase Order",
            "width": 150
        },
        {
            "fieldname": "purchase_order_date",
            "label": _("Purchase Order Date"),
            "fieldtype": "Date",
            "width": 120
        },
        {
            "fieldname": "item_code",
            "label": _("Item Code"),
            "fieldtype": "Link",
            "options": "Item",
            "width": 120
        },
        {
            "fieldname": "description",
            "label": _("Description"),
            "fieldtype": "Data",
            "width": 250
        },
        {
            "fieldname": "supplier",
            "label": _("Supplier"),
            "fieldtype": "Link",
            "options": "Supplier",
            "width": 200
        },
        {
            "fieldname": "cost_center",
            "label": _("Cost Center"),
            "fieldtype": "Link",
            "options": "Cost Center",
            "width": 120
        },
        {
            "fieldname": "uom",
            "label": _("Unit"),
            "fieldtype": "Data",
            "width": 80
        },
        {
            "fieldname": "qty_on_hand",
            "label": _("Qty. On Hand"),
            "fieldtype": "Float",
            "width": 100,
            "precision": 2
        },
        {
            "fieldname": "ordered_qty",
            "label": _("Ordered Qty."),
            "fieldtype": "Float",
            "width": 100,
            "precision": 2
        },
        {
            "fieldname": "last_purchase_date",
            "label": _("Last Pur Date"),
            "fieldtype": "Date",
            "width": 120
        },
        {
            "fieldname": "rate",
            "label": _("Rate"),
            "fieldtype": "Currency",
            "width": 100
        },
        {
            "fieldname": "amount",
            "label": _("Amount"),
            "fieldtype": "Currency",
            "width": 120
        },
        {
            "fieldname": "consumption_1_month",
            "label": _("Consumption 1 Month"),
            "fieldtype": "Float",
            "width": 130,
            "precision": 2
        },
        {
            "fieldname": "user_name",
            "label": _("User Name"),
            "fieldtype": "Data",
            "width": 150
        },
        {
            "fieldname": "remarks",
            "label": _("Remarks"),
            "fieldtype": "Data",
            "width": 150
        }
    ]


def get_data(filters):
    conditions = get_conditions(filters)

    data = frappe.db.sql("""
        SELECT 
            po.name AS po_number,
            po.transaction_date AS purchase_order_date,
            po.owner AS owner,
            po.modified_by AS modified_by,
            po_item.item_code,
            po_item.item_name AS description,
            CONCAT(po.supplier, ' - ', po.supplier_name) AS supplier,
            po_item.cost_center,
            po_item.uom,
            po_item.stock_qty AS ordered_qty,
            po_item.rate,
            po_item.amount,
            po_item.idx
        FROM 
            `tabPurchase Order` po
        INNER JOIN 
            `tabPurchase Order Item` po_item 
            ON po.name = po_item.parent
        WHERE 
            po.docstatus = 1
            {conditions}
        ORDER BY 
            po.transaction_date DESC, po.name, po_item.idx
    """.format(conditions=conditions), filters, as_dict=1)

    result = []

    for row in data:
        # ✅ Ensure date is preserved
        row.purchase_order_date = row.get("purchase_order_date")

        # Get User Name (full name of the user)
        user_id = row.modified_by or row.owner
        row.user_name = get_user_full_name(user_id)

        # Qty on Hand
        qty_on_hand = frappe.db.sql("""
            SELECT SUM(actual_qty) 
            FROM `tabBin` 
            WHERE item_code = %s
        """, row.item_code)

        row.qty_on_hand = flt(qty_on_hand[0][0]) if qty_on_hand and qty_on_hand[0][0] else 0.0

        # Last Purchase
        last_purchase = frappe.db.sql("""
            SELECT 
                po.transaction_date,
                po_item.rate
            FROM 
                `tabPurchase Order` po
            INNER JOIN 
                `tabPurchase Order Item` po_item 
                ON po.name = po_item.parent
            WHERE 
                po.docstatus = 1
                AND po_item.item_code = %s
                AND po.name != %s
            ORDER BY 
                po.transaction_date DESC
            LIMIT 1
        """, (row.item_code, row.po_number))

        if last_purchase:
            row.last_purchase_date = last_purchase[0][0]
            if not row.rate and last_purchase[0][1]:
                row.rate = last_purchase[0][1]
        else:
            # ✅ fallback to current PO date
            row.last_purchase_date = row.purchase_order_date

        # Monthly Consumption
        monthly_consumption = frappe.db.sql("""
            SELECT 
                ABS(SUM(actual_qty))
            FROM 
                `tabStock Ledger Entry`
            WHERE 
                item_code = %s
                AND actual_qty < 0
                AND posting_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
        """, row.item_code)

        row.consumption_1_month = flt(monthly_consumption[0][0]) if monthly_consumption and monthly_consumption[0][0] else 0.0

        row.remarks = ""

        result.append(row)

    return result


def get_user_full_name(user_id):
    """Get full name of the user"""
    if not user_id:
        return ""
    
    # Get user's full name from User document
    user_full_name = frappe.db.get_value("User", user_id, "full_name")
    
    if user_full_name:
        return user_full_name
    
    # If full_name not found, try first_name and last_name
    user = frappe.db.get_value("User", user_id, ["first_name", "last_name"], as_dict=1)
    if user:
        return f"{user.first_name or ''} {user.last_name or ''}".strip()
    
    # Fallback: return the user_id
    return user_id


def get_conditions(filters):
    conditions = []

    if filters.get("from_date"):
        conditions.append("po.transaction_date >= %(from_date)s")

    if filters.get("to_date"):
        conditions.append("po.transaction_date <= %(to_date)s")

    if filters.get("supplier"):
        conditions.append("po.supplier = %(supplier)s")

    if filters.get("cost_center"):
        conditions.append("po_item.cost_center = %(cost_center)s")

    if filters.get("item_code"):
        conditions.append("po_item.item_code = %(item_code)s")

    if filters.get("purchase_order"):
        conditions.append("po.name = %(purchase_order)s")

    return " AND " + " AND ".join(conditions) if conditions else ""


@frappe.whitelist()
def get_filters():
    return [
        {
            "fieldname": "from_date",
            "label": _("From Date"),
            "fieldtype": "Date",
            "default": frappe.utils.add_months(frappe.utils.today(), -1)
        },
        {
            "fieldname": "to_date",
            "label": _("To Date"),
            "fieldtype": "Date",
            "default": frappe.utils.today()
        },
        {
            "fieldname": "supplier",
            "label": _("Supplier"),
            "fieldtype": "Link",
            "options": "Supplier"
        },
        {
            "fieldname": "cost_center",
            "label": _("Cost Center"),
            "fieldtype": "Link",
            "options": "Cost Center"
        },
        {
            "fieldname": "item_code",
            "label": _("Item Code"),
            "fieldtype": "Link",
            "options": "Item"
        },
        {
            "fieldname": "purchase_order",
            "label": _("Purchase Order"),
            "fieldtype": "Link",
            "options": "Purchase Order"
        }
    ]