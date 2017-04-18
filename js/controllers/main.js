'use strict';

angular.module('rss-client')
.controller('mainCtrl', function($scope, items){
	$scope.items = items;
/*		localStorage.setItem('feeds', JSON.stringify([]));/*
		{
			title: 		"eldiario",
			url: 		"http://www.eldiario.es/",
			entries: [
				{
					id:			"http://www.eldiario.es/politica/PSOE-presenta-censura-presidente-Murcia_0_625737559.html",
					title:		"El PSOE presenta una moción de censura contra el presidente de Murcia",
					date:		"2016-03-24T11:44:02Z", 
					author: 	"EFE/eldiario.es - Murcia",
					summary:	"Podemos la apoyará para que dirija el Ejecutivo si va acompañado de un programa de Gobierno, mientras Ciudadanos apuesta por nuevas elecciones",
					read: 		false, 
					faved: 		false
				},
				{
					id:			"http://www.eldiario.es/sociedad/Union-Europea-prohibir-insecticidas-agricolas_0_625737593.html",
					title:		"La Comisión Europea prepara la prohibición de insecticidas agrícolas para salvar a las abejas",
					date:		"2017-03-24T11:45:02Z", 
					author: 	"eldiario.es",
					summary:	"La nueva regulación afecta a tres componentes fabricados por los gigantes Bayer y Syngenta",
					read:		false, 
					faved: 		true
				}
			]
		},
	]));*/

	localStorage.setItem('urls', JSON.stringify([
		"http://eldiario.es/rss",
		"http://elpais.com/tag/rss/cine/a/"
		]
	));
});