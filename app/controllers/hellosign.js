'use strict';

(function() {

require('../../config/config');

var username = process.env.HELLOSIGN_USERNAME
  , password = process.env.HELLOSIGN_PASSWORD;

var request = require('request');

module.exports = {
	// Set callback URL.
  setCallbackUrl: function (callbackUrl, cb) {
		var qs = {
			callback_url: callbackUrl
		};
		var opts = {
			uri: 'https://' + username + ':' + password + '@api.hellosign.com/v3/account',
			method: 'POST',
			timeout: 50000,
			followRedirect: true,
			maxRedirects: 10,
			qs: qs
		};
		request(opts, cb);
  },
  // Create signature request.
  createSigRequest: function (recipient, cb) {
		// recipient: name, email, pin, and number
		var qs = {
			test_mode: 1,
			reusable_form_id: '9417e81c9241c46e964984fd0594e8a7bc5df9f4',
			title: 'Signature required',
			subject: 'Signature required',
			message: 'Hey there! We are looking for somebody to sign this document. However, minimum sexiness standards required.',
			signing_redirect_url: 'http://rack.1.mshcdn.com/media/ZgkyMDEzLzA4LzA1LzYyL2FuY2hvcm1hbi42NjJkYS5naWYKcAl0aHVtYgk4NTB4NTkwPgplCWpwZw/009ee80f/1c0/anchorman.jpg',
			signers: {
				'Sexiest_developer_2011': {
					name: recipient.name,
					email_address: recipient.email,
					pin: recipient.pin
				}
			}
		};

		// https://[username]:[password]@api.hellosign.com/v3/account
		var opts = {
			uri: 'https://' + username + ':' + password + '@api.hellosign.com/v3/signature_request/send_with_reusable_form',
			method: 'POST',
			timeout: 50000,
			followRedirect: true,
			maxRedirects: 10,
			qs: qs
		};

		// Send POST to HelloSign: name, email address, PIN, funny document.
		request(opts, cb);
  }
};

}());