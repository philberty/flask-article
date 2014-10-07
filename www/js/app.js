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
	$interval(function() {
	    $http.get('/api/hostinfo').success(function(data) {
		$scope.info = data
	    })
	}, 1000)

	$interval(function() {
	    $http.get('/api/hoststats').success(function(data) {
		$scope.stats = data
	    }, 500)
	})
    })

    angular.bootstrap(document, ['StatsApp']);

    return app;
});
