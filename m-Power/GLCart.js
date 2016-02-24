/*jslint browser:true */
/*global jQuery:false, cityStateZipMatch:false, warning:true, getShipping:true, alert:false, state:false,
window:false, escape:false, unescape:false, states:false */
function getReturnData(data) {
  'use strict';
  var i;
  for (i = 0; i < data.length; i = i + 2) { //Return data from a retrieval
    jQuery('INPUT[name=' + data[i] + ']').val(data[i + 1]);
  }
}

function getShipping(asyncParm) {
  'use strict';
  var url, company, address1, address2, address3, city, stateCode, zipCode, country, shipMethod, callInAsync, rate, tax;
  if (jQuery.trim(jQuery('input#SHIP_TO_ZIP').val()).length !== 5 || jQuery.trim(jQuery('select#SHIP_TO_STATE').val()).length !== 2 || jQuery.trim(jQuery('select#SHIP_TO_CITY').val()).length === 0) {
    alert('Please enter a valid city, state, and zip code to calculate shipping!');
  } else {
    jQuery('span.load').addClass('loading').removeClass('load');
    jQuery('span.shippingSubtotal').hide();
    url = 'WEBSHVA.M00045s?action_mode=add&one_step=1';
    company = jQuery.trim(jQuery('input#SHIP_TO_NAME').val());
    address1 = jQuery.trim(jQuery('input#SHIP_TO_ADDRESS1').val());
    address2 = jQuery.trim(jQuery('input#SHIP_TO_ADDRESS2').val());
    address3 = jQuery.trim(jQuery('input#SHIP_TO_ADDRESS3').val());
    city = jQuery.trim(jQuery('select#SHIP_TO_CITY').val());
    stateCode = jQuery.trim(jQuery('select#SHIP_TO_STATE').val());
    zipCode = jQuery.trim(jQuery('input#SHIP_TO_ZIP').val());
    country = jQuery.trim(jQuery('select#SHIP_TO_COUNTRY').val());
    shipMethod = jQuery.trim(jQuery('select#CARRIER').val());
    callInAsync = (asyncParm === 'no') ? false : true;
    jQuery.ajax({
      url: url + '&SHIP_TO_NAME=' + company + '&SHIP_TO_ADDRESS1=' + address1 + '&SHIP_TO_ADDRESS2=' + address2 + '&SHIP_TO_ADDRESS3=' + address3 + '&SHIP_TO_CITY=' + city + '&SHIP_TO_STATE=' + stateCode + '&SHIP_TO_ZIP=' + zipCode + '&SHIP_TO_COUNTRY=' + country + '&CARRIER=' + shipMethod + '&x=' + Math.random(),
      async: callInAsync
    }).error(function () {
      jQuery('span.loading').addClass('load').removeClass('loading');
      jQuery('span.rateMsg').text('Sorry -- there was a problem with your request.  Please contact customer support to resolve.');
      jQuery('input.calcRate').css('visibility', 'visible');
      window.getRateSuccess = false;
    }).success(function (html) {
      jQuery('span.loading').addClass('load').removeClass('loading');
      //jQuery('span.shippingSubtotal').show();
      rate = jQuery.trim(jQuery(html).filter('span.newrate').text());
      tax = jQuery.trim(jQuery(html).filter('span.taxamount').text());
      if (callInAsync) {
        jQuery('span#shippingCartDetail').load('WEBSHVA.R00020s?run=2&data=1&Shipping=' + rate + '&Tax=' + tax + '&x=' + Math.random());
      } else {
        jQuery('span.shippingSubtotal').show();
      }
      jQuery('input[name="ORDER_FREIGHT"]').val(rate.replace('$', ''));
      //jQuery('input.payment').removeAttr('disabled').css('visibility', 'visible');
      //jQuery('li.pay a').removeClass('disabled');
      window.getRateSuccess = true;
    });
  }
}

function setCookie(c_name, value) {
  'use strict';
  var c_value = escape(value);
  document.cookie = c_name + '=' + c_value;
}

function saveValues() {
  'use strict';
  jQuery('input.mrcinput, textarea.mrcinput, select.mrcselect').each(function () {
    setCookie(jQuery(this).attr('name'), jQuery.trim(jQuery(this).val()));
  });
}

function getCookie(c_name) {
  'use strict';
  var i, x, y, ARRcookies = document.cookie.split(';');
  for (i = 0; i < ARRcookies.length; i += 1) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1);
    x = x.replace(/^\s+|\s+$/g, '');
    if (x === c_name) {
      return unescape(y);
    }
  }
}

function capitalize(str) {
  'use strict';
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// city-state-zip validation begins
function cityStateZipMatch() {
  'use strict';
  var i, x, city_key, city_part, zip_part, statename;
  statename = jQuery('#SHIP_TO_STATE').val().toLowerCase();
  for (i = 0; i < state[statename].length; i += 1) {
    city_key = state[jQuery('#SHIP_TO_STATE').val().toLowerCase()][i];
    x = city_key.split(',');
    city_part = capitalize(x[0]);
    zip_part = x[1];
    if (city_part.indexOf(jQuery('#SHIP_TO_CITY').val()) !== -1 && jQuery.trim(jQuery('#SHIP_TO_CITY').val()) !== '') {
      if (zip_part.indexOf(jQuery('#SHIP_TO_ZIP').val()) !== -1 && jQuery.trim(jQuery('#SHIP_TO_ZIP').val()) !== '') {
        return true;
      }
      break;
    }
  }
  jQuery('span#mismatch').text('Please ensure that city, state and zip code match');
  return false;
}

jQuery(function () {
  'use strict';
  //add color to readonly input 
  jQuery(':input[readonly]').css('background-color', '#CCC');
  //Setup for switch mode radio button
  var mode = jQuery('#action_mode').val(), id = 'radio' + mode.substring(0, 1);
  jQuery('#' + id).attr('checked', true);
  jQuery('.switch-radio').click(function () {
    var val = jQuery(this).val();
    jQuery('#action_mode').val(val);
    jQuery('form').submit();
  });
  //GL Logic begins
  //Initialize page
  jQuery('form').validate({
    rules: {
      SHIP_TO_EMAIL: {
        email: true
      }
    },
    messages: {
      SHIP_TO_EMAIL: {
        email: 'Please enter a valid email address'
      }
    },
    errorElement: 'div',
    errorClass: 'errortext'
  });
  jQuery('input#SHIP_TO_PHONE').mask('(999) 999-9999');
  jQuery('input#SHIP_TO_ZIP').mask('99999');
  jQuery('li.ship a').addClass('active');
  jQuery('textarea#INSTRUCTIONS').val(jQuery('input[name="COMMENT1"]').val().replace('|', ' ') + jQuery('input[name="COMMENT2"]').val().replace('|', ' '));
  //Attach events
  jQuery('body').delegate('[mrcrequired="required"]', 'blur', function () {
    if (jQuery.trim(jQuery(this).val()) !== '') {
      jQuery('div#' + jQuery(this).attr('id') + 'fieldRequired').css('display', 'none');
    }
  });
  jQuery('form').submit(function () {
    if (cityStateZipMatch()) {
      var comments = jQuery('textarea#INSTRUCTIONS').val();
      if (comments.length <= 100) {
        if (comments[49] === ' ') {
          comments = comments.substring(0, 49) + '|' + comments.substring(50);
        }
        jQuery('input[name="COMMENT1"]').val(comments.substring(0, 50));
        if (comments[50] === ' ') {
          comments = comments.substring(0, 50) + '|' + comments.substring(51);
        }
        jQuery('input[name="COMMENT2"]').val(comments.substring(50));
      }
      jQuery('input.payment').attr('disabled', 'disabled');
      warning = null;
      return true;
    }
  });
  jQuery('body').delegate('select#CARRIER', 'change', function () {
    if (jQuery.trim(jQuery('input#SHIP_TO_ZIP').val()).length === 5 && jQuery.trim(jQuery('select#SHIP_TO_STATE').val()).length === 2) {
      getShipping('');
    } else {
      alert('Please enter a valid zip code and state to calculate shipping!');
    }
  });

  // Populate the state drop down with state values
  jQuery.each(states, function (val, text) {
    jQuery('#SHIP_TO_STATE').append(jQuery('<option></option>').val(text[1]).html(text[0]));
  });
  // Update the cities when the state is selected  
  jQuery('#SHIP_TO_STATE').change(function () {
    jQuery('.errortext.zipCode').hide();
    jQuery('#SHIP_TO_STATE option[value=""]').hide();
    jQuery('#SHIP_TO_ZIPDD').hide();
    jQuery('#SHIP_TO_ZIP').val('').show();
    jQuery('#SHIP_TO_CITY').removeAttr('disabled').children().remove();
    jQuery('#SHIP_TO_CITY').append(jQuery('<option value="">Select City</option>'));
    jQuery.each(state[jQuery('#SHIP_TO_STATE').val().toLowerCase()], function (val, text) {
      jQuery('#SHIP_TO_CITY').append(jQuery('<option></option>').val(capitalize(text.split(',')[0])).html(capitalize(text.split(',')[0])));
    });
    jQuery('input[name="SHIP_TO_COUNTRY"]').val('USA');
  });
  // Update zip input when selection is made
  jQuery('#SHIP_TO_ZIPDD').change(function () {
    jQuery('.errortext.zipCode').hide();
    if (jQuery(this).val() === '') {
      jQuery(this).hide();
      jQuery('#SHIP_TO_ZIP').val('').show();
    } else {
      jQuery('#SHIP_TO_ZIP').val(jQuery(this).val());
    }
  });
  // Update the zip when the city is selected
  jQuery('#SHIP_TO_CITY').change(function () {
    jQuery('.errortext.zipCode').hide();
    if (jQuery(this).val() === '') {
      jQuery('#SHIP_TO_STATE').trigger('change');
    } else {
      var i, city_key, x, city_part, zip_part, ret_zips = 'unknown';
      for (i = 0; i < state[jQuery('#SHIP_TO_STATE').val().toLowerCase()].length; i += 1) {
        city_key = state[jQuery('#SHIP_TO_STATE').val().toLowerCase()][i];
        x = city_key.split(',');
        city_part = capitalize(x[0]);
        zip_part = x[1];
        if (city_part.indexOf(jQuery(this).val()) !== -1) {
          ret_zips = zip_part.split('|');
          jQuery('input.calcRate').css('visibility', 'visible');
          break;
        }
      }
      //if zip is filled in, ensure that city matches and leave alone, otherwise create as dropdown
      if (jQuery.inArray(jQuery.trim(jQuery('#SHIP_TO_ZIP').val()), ret_zips) > -1) {
        return;
      }
      jQuery('#SHIP_TO_ZIPDD').children().remove();
      jQuery('#SHIP_TO_ZIPDD').append(jQuery('<option value="">Select Zip Code</option>'));
      jQuery.each(ret_zips, function (val, zip) {
        jQuery('#SHIP_TO_ZIPDD').append(jQuery('<option></option>').val(zip).html(zip));
      });
      jQuery('#SHIP_TO_ZIP').hide();
      jQuery('#SHIP_TO_ZIPDD').show();
      //if one zip set dropdown to that zip else set dropdown to blank option
      if (ret_zips.length > 1) {
        jQuery('#SHIP_TO_ZIPDD').val('');
        jQuery('#SHIP_TO_ZIP').val('');
      } else {
        jQuery('#SHIP_TO_ZIPDD').val(zip_part);
        jQuery('#SHIP_TO_ZIP').val(zip_part);
      }
    }
  });
  // Update the city and state if the zip is entered
  jQuery('#SHIP_TO_ZIP').keyup(function (e) {
    var ret_city, ret_cities, city_key, city_part, ret_state, state_key, zip_part, zipval, code, x, i;
    code = parseInt((e.keyCode || e.which), 10);
    if (code === 9 || code === 16) {
      return;
    }
    ret_city = '';
    ret_state = '';
    zipval = jQuery('#SHIP_TO_ZIP').val();
    //if zip is 5 digits, find associated city and state
    if (zipval.length !== 5) {
      return;
    }
    for (state_key in state) {
      if (state.hasOwnProperty(state_key)) {
        for (i = 0; i < state[state_key].length; i += 1) {
          city_key = state[state_key][i];
          x = city_key.split(',');
          city_part = x[0];
          zip_part = x[1];
          if (zip_part.indexOf(zipval) !== -1) {
            ret_city = ret_city + ',' + city_part;
            ret_state = state_key;
          }
        }
        if (ret_city !== '') {
          ret_city = ret_city.substring(1);
          jQuery('input[name="SHIP_TO_COUNTRY"]').val('USA');
          break;
        }
      }
    }
    // If found, update the city and state dropdowns
    if (ret_state !== '') {
      jQuery('#SHIP_TO_STATE option[value=""]').hide();
      jQuery('.errortext.zipCode').hide();
      jQuery('#SHIP_TO_STATE').val(ret_state.toUpperCase()); //.attr('selected', 'selected');
      ret_cities = ret_city.split(',');
      jQuery('#SHIP_TO_CITY').removeAttr('disabled').children().remove();
      jQuery('#SHIP_TO_CITY').append(jQuery('<option value="">Select City</option>'));
      jQuery.each(ret_cities, function (val, city) {
        jQuery('#SHIP_TO_CITY').append(jQuery('<option></option>').val(capitalize(city)).html(capitalize(city)));
      });
      if (ret_cities.length > 1) {
        jQuery('#SHIP_TO_CITY').val('');
      } else {
        jQuery('#SHIP_TO_CITY').val(capitalize(ret_city));
      }
    } else {
      jQuery('#SHIP_TO_STATE option[value=""]').show();
      jQuery('#SHIP_TO_STATE').val('');
      jQuery('#SHIP_TO_CITY').attr('disabled', 'disabled').children().remove();
      jQuery('.errortext.zipCode').show();
    }
  });
  window.warning = null;
  jQuery('body').delegate('form', 'change', function () {
    warning = '';
    jQuery('input.payment').removeAttr('disabled');
  });
  // Handle values on page load
  jQuery('input.mrcinput, textarea.mrcinput, select.mrcselect').each(function () {
    if (jQuery.trim(jQuery(this).val()) === '') {
      jQuery(this).val(jQuery.trim(getCookie(jQuery(this).attr('name'))));
    }
  });
  jQuery('#SHIP_TO_ZIP').trigger('keyup');
  if (jQuery.trim(jQuery('span#storedCity').text()) !== '') {
    jQuery('#SHIP_TO_CITY').val(jQuery.trim(jQuery('span#storedCity').text()));
  }
  if (jQuery.trim(jQuery('input#SHIP_TO_ZIP').val()).length === 5 && jQuery.trim(jQuery('select#SHIP_TO_STATE').val()).length > 0 && jQuery.trim(jQuery('select#SHIP_TO_CITY').val()).length > 0) {
    getShipping('');
  }
  window.onbeforeunload = function () {
    if (warning !== null) {
      saveValues();
    }
  };
});