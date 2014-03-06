'use strict';

(function() {

/**
 * Import helpers ==============================================================
 */
require('../config/config');

var hellosign = require('../app/controllers/hellosign')
	, Twilio = require('twilio')(process.env.TWILIO_ASID,
  process.env.TWILIO_AUTH_TOKEN)
	, twilio_number = process.env.TWILIO_NUMBER;


// Public functions. ===========================================================
module.exports = function (app, io) {
	// API routes ================================================================
	app.post('/api/sigreq', function (req, res) {
		var load = req.body;

		hellosign.setCallbackUrl('http://hellosign-andy.herokuapp.com/api/events/'
		// hellosign.setCallbackUrl('http://4fa26fca.ngrok.com/api/events/'
			+ load.number, function (err, r, body) {
			if (err)
				res.send(err, 400);

			// console.log('setting callback url');
			// console.log(body);
			res.send(body, 200);
		});

		hellosign.createSigRequest(load, function (err, r, body) {
			if (err)
				res.send(err, 400);

			// console.log('sigreq created');
			// console.log(body);
			res.send(body, 200);
		});

		// Send POST to Twilio to send SMS to number with PIN as body.
		Twilio.sendMessage({
      to: load.number,
      from: twilio_number,
      body: 'The PIN needed for your signature request is ' + load.pin
    }, function (err, responseData) {
      if (err)
        console.log(err);
    });
	});

	// Endpoint for HelloSign webhook
	app.post('/api/events/:number', function (req, res) {
		var load = JSON.parse(req.body.json)
			, body = '';

		// console.log(load);

		if (load.event.event_type === 'signature_request_sent') {
			body = 'Hey ' + load.signature_request.signatures[0].signer_name
				+ ', the signature request is sent to '
				+ load.signature_request.signatures[0].signer_email_address;
		} else if (load.event.event_type === 'signature_request_signed') {
			body = 'Your e-signature was received! Thank you.';
		}

		if (body.length > 0) {
			Twilio.sendMessage({
				to: '+1' + req.params.number,
				from: twilio_number,
				body: body
			}, function (err, res) {
				if (err)
					console.log(err);
			});
		}
		
		// console.log(req.params.number);
		// console.log(body);

		res.send("Hello API Event Received", 200);
	});

	// Application routes ========================================================
	app.get('/', function (req, res) {
    res.sendfile('index.html', {'root': './public/views/'});
  });
};

}());