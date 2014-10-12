require.config({
    paths: {
        angular: '/js/lib/angular/angular',
    },
    shim: {
        'angular': {
            exports: 'angular'
        }
    },
    deps: ['app']
});

define('app', ["angular"], function(angular)
{
    var app = angular.module("StatsApp", []);

    app.controller('app', function($scope, $interval, $http) {
	var hostInfo = function() {
	    $http.get('/api/hostinfo').success(function(data) {
		$scope.info = data
	    })
	}
	var hostStats = function() {
	    $http.get('/api/hoststats').success(function(data) {
		$scope.stats = data
	    })
	}
	var hostPids = function() {
	    $http.get('/api/hostpids').success(function(data) {
		$scope.pids = data['pids']
	    })
	}
	$interval(hostInfo, 2000)
	$interval(hostStats, 1000)
	$interval(hostPids, 3000)
    })

    angular.bootstrap(document, ['StatsApp']);

    return app;
});
