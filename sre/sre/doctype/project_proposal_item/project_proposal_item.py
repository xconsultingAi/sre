# Copyright (c) 2025, ashuar and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class ProjectProposalItem(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		amount: DF.Currency
		brand: DF.ReadOnly | None
		cost_per_watt: DF.Currency
		item: DF.Link
		model: DF.ReadOnly | None
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		qty: DF.Float
	# end: auto-generated types

	pass
