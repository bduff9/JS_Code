/* Auditing.js
 * 2016-02-01
 * Brian Duffey
 * Makes an AJAX call to auditApp to audit application usage.
 * Uses jQuery to make ajax call, script tag should be placed after jQuery library (such as bottom of footer).
 * Returns an Auditing object, that can be used globally, if needed
 */
var Auditing = (function($, w) {
	'use strict';
/***************  EDIT THIS SECTION ONLY **********************************/
	var dict = 'CATT5',
		auditApp = 'M00009s',
		nameOfAppField = 'auditapp',
		dataToPass = {
			one_step: 1, // one step write
			action_mode: 'add', // add new record
			// App specific fields below
			auditact: 'APP_RUN' // pass APP_RUN to auditact field
		};
/***************  END OF SECTION TO EDIT **********************************/

	// Functions
	function getCurrApp() {
		var pathArr = w.location.pathname.split('/' + dict + '.'),
			app = pathArr[pathArr.length - 1];
		return app;
	}
	function makeAuditCall(app) {
		dataToPass[nameOfAppField] = app;
		$.ajax({ url: dict + '.' + auditApp, data: dataToPass }).fail(logErrors);
	}
	function logErrors(jqXHR, textStatus, err) {
		console.error(textStatus);
		console.error(err);
	}

	// On load
	try {
		makeAuditCall(getCurrApp());
	} catch(err) {
		logErrors(null, 'Failed to make AJAX call', err);
	}

	return {};
}(jQuery, window));
