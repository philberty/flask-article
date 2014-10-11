require.config({
    paths: {
	jquery: '/js/lib/jquery/dist/jquery',
	flot: '/js/lib/flot/jquery.flot',
        angular: '/js/lib/angular/angular',
        angularRoute: '/js/lib/angular-route/angular-route',
    },
    shim: {
	'flot': {
	    deps: ['jquery'],
	    exports: 'flot'
	},
        'angularRoute': {
            deps: ['angular'],
            exports: 'angular'
        },
        'angular': {
	    deps: ['jquery'],
            exports: 'angular'
        }
    },
    deps: ['app']
});

define('app', ["flot", "angular", "angularRoute"], function($, angular)
{
    var app = angular.module("StatsApp", ['ngRoute']);
    
    app.config(
        ['$routeProvider',
            function($routeProvider) {
                $routeProvider
                    .when('/host', {
                        templateUrl: 'host.html',
                        controller: 'host'
                    })
                    .when('/', {
                        redirectTo: "/host"
                    })
                    .otherwise({
                        redirectTo: '/'
                    })
            }
        ]
    )

    app.controller('host', function($scope, $interval, $http) {
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
