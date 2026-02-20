# Copyright (c) 2025, ashuar and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class TimeLog(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		customers_remarks: DF.SmallText | None
		from_date: DF.Datetime | None
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		to_date: DF.Datetime | None
	# end: auto-generated types

	pass
