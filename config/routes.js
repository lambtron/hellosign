'use strict';

(function() {

/**
 * Import helpers ==============================================================
 */

// Public functions. ===========================================================
module.exports = function (app, io) {
	// API routes ================================================================
	app.post('/api/sigreq', function (req, res) {
		console.log(req.body);
		var load = req.body;

		// Send POST to HelloSign: name, email address, PIN, funny document.


		// Send POST to Twilio to send SMS to number with PIN as body.

	});

	// Endpoint for HelloSign webhook
	app.post('/api/sigreq/success', function (req, res) {
		// If success, initiate SMS body 'success'.

		// Otherwise, initiate SMS body 'failure'.
	});

	// Application routes ========================================================
	app.get('/', function (req, res) {
    res.sendfile('index.html', {'root': './public/views/'});
  });
};

}());