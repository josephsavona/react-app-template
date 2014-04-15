var ga = function() {};
if (typeof window !== 'undefined' && typeof window.ga !== 'undefined') {
  ga = window.ga;
}

module.exports = {
  useGa: function(newGa) {
    ga = newGa;
  },
  initialize: function(id) {
    ga('create', id, 'auto');
  },
  initializeEcommerce: function() {
    ga('require', 'ecommerce', 'ecommerce.js');
  },
  setCustom: function(params) {
    if (!params) {
      return;
    }
    ga('set', params);
  },
  pageview: function(page, title) {
    if (!page) {
      return ga('send', 'pageview');
    }
    ga('send', {
      hitType: 'pageview',
      page: page,
      title: title
    })
  },
  event: function(options) {
    ga('send', {
      hitType: 'event',
      eventCategory: options.category,
      eventAction: options.action,
      eventLabel: options.label,
      eventValue: options.value
    })
  }
}