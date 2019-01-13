// ------------------------------------------------------
// Project: Star Wars API test
//
// Author: David Gentry
// Date: 1-12-2019
// Version: 0.1
//
// This is a simple NodeJS file used to demonstrate 
// pulling data from a publicly available online API 
// to present data to the user depending upon the input
// as well as to show data loading and transformation.
//
// ------------------------------------------------------

'use strict'

const swapi = require('swapi-node');

var planets = [];	// array of objects of all planets and their data from SWAPI
var people = [];	// array of objects of all people and their data from SWAPI
var minPlanets = [];	// array of minimal planet object data
var minPeople = []; 	// array of minimal people object data
var unified = [];	// array of objects that is a combination of people and planets
var searchName = '';	// the name of the planet the user is searching

console.log(' Star Wars - Planets and People ... initializing');

// make sure the user entered the name of a planet before we waste time pulling data from swapi.co
if( getArgs() === false ) {
	console.log('Usage: starwars <planet-name>');
	console.log('   This will return a list of names of all the people from that planet');
} else {
	//go ahead and load all data, build structures and print the info needed
	main();
}

// the main function, loads the data, shows the basic info, creates the new structure and prints out the desired info 
async function main() {

	// first, load the planets and people, then parse the data
	await loadPlanets();
	await loadPeople();

	console.log(" found " + planets.length + " planets, and " + people.length + " people");

	// print out the minimized array structures
	printBasicInfo();

	// create the unified data structure
	createUnifiedArray();

	// look up the name of the planet passed in on the command line and print a list of all residents
	printAllRequestedPeople();
};

// print all the people/residents that are listed under a planet's object entry in the unified array
function printAllRequestedPeople() {
	var bFound = false;

	// look for the searchName and print any residents found, or state that no residents are found
	for( var i=0; i<unified.length; i++ ) {
		if( unified[i].planet.toLowerCase()  === searchName.toLowerCase() ) {  // be forgiving of capitalization
			bFound = true;
			if( unified[i].people.length > 0 ) {
				console.log('\nHere are all the people listed as residents of planet ' + searchName + '\n');
				
				console.log( unified[i].people);
			} else {
				console.log( '\nPlanet ' + searchName + ' found, but no people listed');
			}
			break;
		}	
	}
	if( !bFound ) {
		console.log( "Planet named: " + searchName + " not found in the list, try again");
	}

};

// print out the basic planets and people object arrays (one of the requirements of the task)
function printBasicInfo() {
	console.log("Planets:");
	console.log("--------");
	console.log(JSON.stringify(minPlanets, null, 4));
	console.log(" ");
	console.log("People:");
	console.log("-------");
	console.log(JSON.stringify(minPeople, null, 4));
};

// create a single array of data objects that have the combined planet names and people/residents of that planet
function createUnifiedArray() {
	// this function will build an array of objects based on the planet name, listing all resident names
	// the raw planet data already had a residents array. This replicates that part but with names
	// substituted

	console.log(" building unified list of people and planets ")
	var obj = {};
	var residents =[];
	for(var i=0; i<minPlanets.length; i++) {
		obj.planet = minPlanets[i].name;		// get the planet name
		for(var j=0; j<minPeople.length; j++) {		// look for people from that homeworld
			if(minPeople[j].homeworld === minPlanets[i].name) {
				residents.push(minPeople[j].name);
			}
		}
		obj.people = residents;				// add the array of residents to the list
		unified.push(obj);				// add this objecto the unified array
		residents = [];
		obj = {};					// flush the data to ensure it was copied and not referenced
	}
	//console.log(unified);
}

// load the raw planet data from the swapi.co website and build a new array with minimal information about each entry.  This is an asynchronous function
async function loadPlanets() {
	var obj = {};
	var min = {}; //'name':'','numresidents':0,'url':''};
	var bDone = false;

	//console.log(" in loadPlanets()... ");
	// get first page and see if there are any more
	var p = await swapi.get('https://swapi.co/api/planets/');
	
	while( !bDone ) {
		for(var i=0; i<p.results.length; i++) {
			var o = p.results[i];
			planets.push(o);
			o = {};
		}
		if( p.next !== null ) {
			p = await swapi.get(p.next); 
		} else {
			bDone = true;
		}
	}

	console.log("number of planets = " + planets.length);
	for( var j=0; j<planets.length; j++ ){
		//console.log(planets[j].name);
		min.name = planets[j].name;
		min.url = planets[j].url;
		min.numresidenets = planets[j].residents.length;
		minPlanets.push(min);
		min = {};
	}
};


// load the raw people data from the swapi.co website and build a new array with minimal information about each entry.  This is an asynchronous function
async function loadPeople() {
	var obj = {};
	var min = {};
	var bDone = false;

	//console.log("in loadPeople");
	// get first page and see if there are any mor
	var p = await swapi.get('https://swapi.co/api/people/');

	while( !bDone ) {
		for(var i=0; i<p.results.length; i++) {
			var o = p.results[i];
			people.push(o);
			o = {};
		}

                if( p.next !== null ) {
			p = await swapi.get(p.next);
		} else {
			bDone = true;
		}
	}
	console.log("number of people = " + people.length);
	for( var j=0; j<people.length; j++ ) {
		//console.log(people[j].name);
		min.name = people[j].name;
		min.homeworld = findPlanetFromURL( people[j].homeworld );
		minPeople.push(min);
		min = {};
	}
  
};

// utility function to replace a planet URL with the planet name (makes things easier later)
function findPlanetFromURL( url ) {
	var name = url;

	for(var i=0; i<minPlanets.length; i++) {
		if( minPlanets[i].url === url ) {
			name = minPlanets[i].name;
			break;
		}
	}
	return name;
};

// pulls the arguments from the command line, combining multi-word planet names if necessary
function getArgs() {
	var arrLen = process.argv.length;
	var name = '';

	// format of process.argv = node starwars.js <name>
	if (arrLen < 3) {
		return false;		// not enough arguments
	}

	// some planets in Star Wars are more than one word, any arguments after "node" 
	// and "starwars.js" will be concatenated into a single string to be used to search the list

	if(arrLen > 3) {
		for( var i=2; i<(arrLen); i++ ) {
			name += process.argv[i] + ' ';
		}
		// then trim any outside spaces
		searchName = name.trim();
	} else {
		searchName = process.argv[2].trim();
	}
	console.log("searching for planet: " + searchName);
};

