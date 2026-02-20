# Copyright (c) 2025, ashuar and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class ProjectProposal(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF
		from sre.sre.doctype.project_proposal_item.project_proposal_item import ProjectProposalItem
		from sre.sre.doctype.quarter_cost_saving.quarter_cost_saving import QuarterCostSaving
		from sre.sre.doctype.quarter_energy_gain.quarter_energy_gain import QuarterEnergyGain

		advance_on_po: DF.Percent
		annual_cost_saving: DF.Float
		annual_cost_saving_unit: DF.Data | None
		annual_price_increase: DF.Percent
		annual_price_increase_gas: DF.Percent
		annual_price_increase_gas_unit: DF.Data | None
		annual_price_increase_unit: DF.Data | None
		average_daily_energy_gain: DF.Data | None
		average_daily_energy_gain_unit: DF.Data | None
		business: DF.Data | None
		company_name: DF.Data | None
		corporate_tax_rate: DF.Percent
		cost_per_unit: DF.Currency
		energy_gain_from_system: DF.Float
		energy_gain_from_system_unit: DF.Data | None
		fuel_mix_gas: DF.Percent
		fuel_mix_wapda: DF.Percent
		grand_total: DF.Currency
		items: DF.Table[ProjectProposalItem]
		length_south_facing: DF.Data | None
		length_south_facing_unit: DF.Data | None
		location: DF.Data | None
		naming_series: DF.Literal["PP-.YYYY.-.#####"]
		no_of_operating_days: DF.Int
		no_of_solar_modules: DF.Float
		no_of_solar_modules_unit: DF.Data | None
		no_of_units_saved_gas: DF.Int
		no_of_units_saved_gas_unit: DF.Data | None
		no_of_units_saved_wapda: DF.Int
		no_of_units_saved_wapda_unit: DF.Data | None
		on_project_completion: DF.Percent
		price_of_gas: DF.Float
		price_of_gas_unit: DF.Data | None
		price_of_wapda: DF.Float
		price_of_wapda_unit: DF.Data | None
		primary_source: DF.Data | None
		primary_source_unit: DF.Data | None
		quarterly_cost_saving: DF.Table[QuarterCostSaving]
		quarterly_energy_gain: DF.Table[QuarterEnergyGain]
		secondary_source: DF.Data | None
		secondary_source_unit: DF.Data | None
		single_module_size: DF.Float
		single_module_size_unit: DF.Data | None
		system_size: DF.Float
		system_size_annual: DF.Data | None
		system_size_annual_unit: DF.Data | None
		system_size_unit: DF.Data | None
		template: DF.Link | None
		unit: DF.Data | None
		unit_produced_annually: DF.Float
		unit_produced_annually_unit: DF.Data | None
		width: DF.Data | None
		width_unit: DF.Data | None
		working_days: DF.Int
		working_days_unit: DF.Data | None
	# end: auto-generated types

	pass
