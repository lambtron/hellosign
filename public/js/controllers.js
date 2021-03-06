'use strict';

helloSignApp.controller('mainController',
  ['$scope', '$http',
	function ($scope, $http)
{
	// Initialize variables.
	var signatureRequest = $scope.signatureRequest = {
		postLoad: {
			name: '',
			email: '',
			number: '',
			pin: ''	
		},
		submitted: false,
		submit: function submit() {
			console.log('submitting..');
			$http.post('/api/sigreq', this.postLoad)
			.success( function (data) {
				console.log('Success:');
				console.log(data);
				signatureRequest.submitted = true;
			})
			.error( function (data) {
				console.log('Error:');
				console.log(data);
			});
		}
	};


}]);