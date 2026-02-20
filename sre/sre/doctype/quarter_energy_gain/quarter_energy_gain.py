# Copyright (c) 2025, ashuar and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class QuarterEnergyGain(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		avg_daily_kwh_produced: DF.Float
		avg_daily_kwh_produced_unit: DF.Data | None
		no_of_working_days: DF.Int
		no_of_working_days_unit: DF.Data | None
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		total_energy_gain: DF.Float
		total_energy_gain_unit: DF.Data | None
	# end: auto-generated types

	pass
