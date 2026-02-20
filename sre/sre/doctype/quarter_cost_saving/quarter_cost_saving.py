# Copyright (c) 2025, ashuar and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class QuarterCostSaving(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		cost_saving_mix: DF.Float
		cost_saving_mix_unit: DF.Data | None
		gas_saving: DF.Float
		gas_saving_unit: DF.Data | None
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		wapda_saving: DF.Float
		wapda_saving_unit: DF.Data | None
	# end: auto-generated types

	pass
