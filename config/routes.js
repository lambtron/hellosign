'use strict';

(function() {

/**
 * Import helpers ==============================================================
 */
require('../config/config');

var hs = require('node-hellosign')
  , username = process.env.HELLOSIGN_USERNAME
  , password = process.env.HELLOSIGN_PASSWORD
  , HelloSign = new hs({username: username, password: password});

var Twilio = require('twilio')(process.env.TWILIO_ASID,
  process.env.TWILIO_AUTH_TOKEN)
	, twilio_number = process.env.TWILIO_NUMBER;


// Public functions. ===========================================================
module.exports = function (app, io) {
	// API routes ================================================================
	app.post('/api/sigreq', function (req, res) {
		console.log(req.body);
		var load = req.body;

		// Send POST to HelloSign: name, email address, PIN, funny document.
		var opts = {
			test_mode: 1,
			reusable_form_id: '9417e81c9241c46e964984fd0594e8a7bc5df9f4',
			// title: 'Sign title',
			// subject: 'Subject line',
			// message: 'The message goes here.',
			signing_redirect_url: 'http://www.google.com/',
			signers: {
				Sexiest: {
					name: 'Andy',
					email_address: 'andyjiang@gmail.com',
					pin: '1234'
				}
			}
		};
		HelloSign.createRequest(opts, function (er, res) {
			console.log('HelloSign response:');
			console.log(res);
		});

		// Send POST to Twilio to send SMS to number with PIN as body.
		Twilio.sendMessage({
      to: load.number,
      from: twilio_number,
      body: 'The PIN needed for your signature request is ' + load.pin
    }, function (err, responseData) {
      if (!err) {
        // console.log(responseData);
      } else {
        console.log(err);
      }
    });
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