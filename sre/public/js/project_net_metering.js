frappe.ui.form.on("Project", {
    refresh: function(frm) {
        update_stages(frm);
    },

    custom_net_metering_type: function(frm) {
        update_stages(frm);
    }
});

function update_stages(frm) {
    let options = [];

    if(frm.doc.custom_net_metering_type == "Domestic") {
        options = [
            "File Preparation",
            "File Submission Process",
            "Prepared file",
            "Submitted in Division and Sub-division",
            "Issue Demand Notice (DIN)",
            "Submitted in Relevant Bank",
            "Copy File again submitted in Division / Sub-division",
            "Meter Issue",
            "Meter Installed",
            "For Domestic = 30-35 days required for this process"
        ]; 
    } else if(frm.doc.custom_net_metering_type == "Industrial") {
        options = [
            "File Preparation",
            "File Submission Process",
            "Prepared File Submission (Three Ways: MIRAD, DISCO, P&D)",
            "MIRAD – Approve Agreement",
            "DISCO – Distribution Agreement",
            "P&D – Planning and Development Department File Submission",
            "Prepared File / Submitted File",
            "Return to MIRAD",
            "Submitted to NEPRA",
            "Issue License",
            "License Copy Sent to MIRAD",
            "MIRAD Sends Copy to Division / Sub-division",
            "P-T-O",
            "MIRAD Sends Copy to Division / Sub-division (Additional Step)",
            "MIRAD Generates and Issues Letter Against License",
            "Demand Notice (DIN)",
            "Payment of D/N",
            "D/N In Process",
            "D/N Preparation → Accounts",
            "Payment Submitted in Bank",
            "Copy Submitted in Division / Sub-division",
            "Survey-Site Issue Clearance",
            "MLT Meter Install",
            "MLT",
            "TC (Technical Clearance)",
            "For Billing",
            "Revenue Office (RO)",
            "Feed",
            "Bill Updated"
        ];
    } else if(frm.doc.custom_net_metering_type == "Commercial") {
        options = [
            "File Preparation",
            "File Submission Process",
            "Prepared File Submitted in Division / Sub-division",
            "Demand Notice (D/N)",
            "Payment Submitted in Relevant Bank",
            "Copy File Submitted to Division / Sub-division",
            "Issue",
            "Meter Issue (LT Meter)",
            "Bill Updated",
            "For Commercial = 30-40 days required for this process"
        ];
    }

    frm.set_df_property("custom_stages", "options", options);

    if(!options.includes(frm.doc.custom_stages)) {
        frm.set_value("custom_stages", "");
    }

    frm.refresh_field("custom_stages");
}
