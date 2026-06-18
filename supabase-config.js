// ── ربط Supabase: جلب العقارات المميزة ──────────────────
(function () {

  var ICONS = {
    furnished:   '🏠',
    unfurnished: '🏢',
    chalet:      '🏡',
    villa:       '🏰',
    rest_house:  '🌴'
  };

  var LABELS = {
    furnished:   'شقة مفروشة',
    unfurnished: 'شقة غير مفروشة',
    chalet:      'شاليه',
    villa:       'فيلا',
    rest_house:  'استراحة'
  };

  function buildCard(p) {
    var icon     = ICONS[p.property_type]  || '🏠';
    var label    = LABELS[p.property_type] || p.property_type;
    var location = [p.district_name_ar, p.city_name_ar].filter(Boolean).join('، ');
    var price    = p.monthly_price
      ? Number(p.monthly_price).toLocaleString('ar-SA') + ' ر.س<small>/شهر</small>'
      : '—';
    var rating   = p.avg_rating    ? Number(p.avg_rating).toFixed(1) : '—';
    var reviews  = p.reviews_count ? p.reviews_count + ' تقييم' : 'جديد';
    var beds     = p.bedrooms  ? '🛏️ ' + p.bedrooms  + ' غرف'  : '';
    var baths    = p.bathrooms ? '🚿 ' + p.bathrooms + ' حمام' : '';

    var featsHtml = '';
    if (beds)  featsHtml += '<span class="card-feat">' + beds  + '</span>';
    if (baths) featsHtml += '<span class="card-feat">' + baths + '</span>';

    var imgInner = p.main_image_url
      ? '<img src="' + p.main_image_url + '" alt="" '
        + 'style="width:100%;height:100%;object-fit:cover;" '
        + 'onerror="this.parentElement.innerHTML=\'' + icon + '\'">'
      : icon;

    return '<div class="prop-card" onclick="showPage(\'hotel\')" '
         + 'data-id="' + (p.id || '') + '">'
         + '<div class="card-img">' + imgInner + '</div>'
         + '<div class="card-body">'
         + '<div class="card-type">' + label + '</div>'
         + '<div class="card-name">'  + (p.building_name_ar || 'وحدة سكنية') + '</div>'
         + (location ? '<div class="card-loc">📍 ' + location + '</div>' : '')
         + '<div class="card-feats">' + featsHtml + '</div>'
         + '<div class="card-footer">'
         + '<div class="card-price">' + price + '</div>'
         + '<div class="card-rating"><strong>⭐ ' + rating + '</strong> ' + reviews + '</div>'
         + '</div></div></div>';
  }

  document.addEventListener('supabase:ready', function () {
    fetchFeaturedProperties().then(function (data) {
      if (!data || data.length === 0) return; // ← تبقى البطاقات الوهمية
      var grid = document.getElementById('featured-properties-grid');
      if (!grid) return;
      grid.innerHTML = data.map(buildCard).join('');
    });
  });

})();
