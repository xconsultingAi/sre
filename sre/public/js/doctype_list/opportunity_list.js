frappe.listview_settings['Opportunity'] = {
    onload(listview) {
      listview.page.set_title(__('BOQ'));
    },
  
    refresh(listview) {
      // ensure the primary action exists, then update only the label span
      const $btn = listview.page.btn_primary
        ? $(listview.page.btn_primary)
        : $('.btn.btn-primary.btn-sm.primary-action');
  
      $btn.find('span[data-label]')
        .attr('data-label', encodeURIComponent('Add BOQ')) // optional, but keeps it consistent
        .html('<span><span class="alt-underline">A</span>dd BOQ</span>');
    }
  };