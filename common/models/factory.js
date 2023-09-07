'use strict';

var methodsHelper = require('../../server/helpers/methods');
var loopback = require('loopback');
var app = require('../../server/server');

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');



module.exports = function(Factory) {


/* ---------------------------------- SETTINGS ---------------------------------- */
	
	var methodsToDisplay =  ['create','find'];
	methodsHelper.disableAllExcept(Factory, methodsToDisplay); 


/* ---------------------------------- VALIDATOR --------------------------------- */

	

/* ---------------------------------- REMOTE METHODS ---------------------------- */	
	
	// This methods start External Service to read if users is in associated Company
	Factory.startExternalServices = async() => {

	    var factories = await Factory.find();
	    
	    var errorInModelCreation = false;
	    for(const fact of factories){
	   		 // Create a dynamic DataSource for services
	
		    var ds = await loopback.createDataSource({
	          connector: require("loopback-connector-rest"),
	          debug: false,
	          operations: [{
	            template: {
	              "method": "GET",
	              "url": fact.url + '/Users',
	              "headers": {
	                "accepts": "application/json",
	                "content-type": "application/json"
	              },
				   "query": {
				      "filter": "{filter}"
				    }
	            },
	            functions: {
	              "find": ["filter"]
	            }
	          }]
	        });

		    var model = await ds.createModel(fact.name,app.model.Users);
		    if(!model) {
		    	errorInModelCreation = true;
			}
		}

		return !errorInModelCreation;

	}

	Factory.listFactoryWithUserName = async (username) =>  {

	    try {
		   	
		    var factories = await Factory.find();
		   
		    let returnedFactory = [];	

		    if(factories.length > 0) {

			    for(var fact of factories){

			        var model = await loopback.findModel(fact.name);
			      
			        var filter = {"where":{"username":username}};

					var result = await model.find(filter);

					if(result.length > 0){
						returnedFactory.push(fact);
					}
					
				}

		   }
		   return returnedFactory; 			
			   
	    }catch(results)
	    {
	    	throw(results);
	    }
	};
	Factory.remoteMethod(	
		'listFactoryWithUserName', {
		  http: {
		    path: '/listFactoryWithUserName',
		    verb: 'get'
		  },
		  returns: {arg: 'results', type:['Factory'],root:true },
		  accepts: {arg: 'userName', type: 'string',required: true,description:"Username used to check if users is present in others sub-company"},
		  description: "Get list of all factory where username is present"
	});
	
	Factory.updateAttributes = async (id,properties) => {
	   
		debugger;
		    let results;
		    try
		    {
			const factory = await Factory.findById(id);
			if(factory) {
				results = await factory.updateAttributes(properties);
				return results;	
			}else{
				throw new Error('Azienda non trovata');
			}		
		}
		catch(results) {
			throw(results);
		}	

	};
	Factory.remoteMethod(
		
		'updateAttributes', {
		  http: {
		    path: '/:id/updateAttributes',
		    verb: 'put'
		  },
		  accepts: [{arg: 'id', type: 'number',required: true,description:"The id of factory"},
		  			 {arg: 'properties', type:'Factory' ,http: {source: 'body'},description:"Refer to Model and Model Schema. ID must be removed"}
		  		   ],
		  returns: {arg: 'results', type:'Factory',root:true },
		  description: "Update properties. Admitted all except ID in properties"
	});


	Factory.insertCaledarEvents = async (events) => {

		// If modifying these scopes, delete token.json.
		const SCOPES = ['https://www.googleapis.com/auth/calendar'];
		// The file token.json stores the user's access and refresh tokens, and is
		// created automatically when the authorization flow completes for the first
		// time.
		const TOKEN_PATH = 'token.json';

		// Load client secrets from a local file.
		fs.readFile('credentials.json', async(err, content) => {
		  if (err) return console.log('Error loading client secret file:', err);
		  // Authorize a client with credentials, then call the Google Calendar API.
		  await authorize(JSON.parse(content), listEvents);
		  await insertEvents(events);

		  return {success:true}

		});

	};
	Factory.remoteMethod(
		'insertCaledarEvents', {
		  http: {
		    path: '/insertCaledarEvents',
		    verb: 'post'
		  },
		  accepts: {arg: 'events', type: 'object',description:"The id of factory"},
		  returns: {arg: 'results', type:'object',root:true },
		  description: "Update properties. Admitted all except ID in properties"
	});

	/**
	 * Create an OAuth2 client with the given credentials, and then execute the
	 * given callback function.
	 * @param {Object} credentials The authorization client credentials.
	 * @param {function} callback The callback to call with the authorized client.
	 */
	async function authorize(credentials, callback) {
	  const {client_secret, client_id, redirect_uris} = credentials.installed;
	  const oAuth2Client = new google.auth.OAuth2(
	      client_id, client_secret, redirect_uris[0]);

	  // Check if we have previously stored a token.
	  fs.readFile(TOKEN_PATH, async(err, token) => {
	    if (err) return await getAccessToken(oAuth2Client, callback);
	    oAuth2Client.setCredentials(JSON.parse(token));
	    callback(oAuth2Client);
	  });
	}

	/**
	 * Get and store new token after prompting for user authorization, and then
	 * execute the given callback with the authorized OAuth2 client.
	 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
	 * @param {getEventsCallback} callback The callback for the authorized client.
	 */
	async function getAccessToken(oAuth2Client, callback) {
	  const authUrl = oAuth2Client.generateAuthUrl({
	    access_type: 'offline',
	    scope: SCOPES,
	  });
	  console.log('Authorize this app by visiting this url:', authUrl);
	  const rl = readline.createInterface({
	    input: process.stdin,
	    output: process.stdout,
	  });
	  rl.question('Enter the code from that page here: ', async(code) => {
	    rl.close();
	    oAuth2Client.getToken(code, (err, token) => {
	      if (err) return console.error('Error retrieving access token', err);
	      oAuth2Client.setCredentials(token);
	      // Store the token to disk for later program executions
	      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
	        if (err) return console.error(err);
	        console.log('Token stored to', TOKEN_PATH);
	      });
	      callback(oAuth2Client);
	    });
	  });
	}

	/**
	 * Lists the next 10 events on the user's primary calendar.
	 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
	 */
	async function listEvents(auth) {
	  const calendar = google.calendar({version: 'v3', auth});
	  calendar.events.list({
	    calendarId: 'primary',
	    timeMin: (new Date()).toISOString(),
	    maxResults: 10,
	    singleEvents: true,
	    orderBy: 'startTime',
	  }, (err, res) => {
	    if (err) return console.log('The API returned an error: ' + err);
	    const events = res.data.items;
	    if (events.length) {
	      console.log('Upcoming 10 events:');
	      events.map((event, i) => {
	        const start = event.start.dateTime || event.start.date;
	        console.log(`${start} - ${event.summary}`);
	      });
	    } else {
	      console.log('No upcoming events found.');
	    }
	  });
	}

	async function insertEvents(event, auth) {
	  const calendar = google.calendar({ version: 'v3', auth });
	  var event = event;
	  calendar.events.insert(
	    {
	      auth: auth,
	      calendarId: 'primary',
	      resource: event
	    },
	    function(err, event) {
	      if (err) {
	        console.log(
	          'There was an error contacting the Calendar service: ' + err
	        );
	        return;
	      }
	      console.log('Event created: %s', event.data.htmlLink);
	    }
	  );
	}






/* ---------------------------------- HOOKS ---------------------------- */	


	Factory.observe('after save', async (ctx) =>{ 
  		
  		try {
       		
	    	
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
  	 
	});

	
	Factory.observe('before save', async (ctx) =>{ 

  		try {
       		
	    	
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	});

	Factory.observe('before delete', async (ctx) =>{ 
  		
  		try {
       		
	    	
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	});

	Factory.observe('after delete', async (ctx) =>{ 
  		
  		try {
       		
	    	
	    } catch(error){

	      return Promise.reject(error.message);
	    
	    }

	    return Promise.resolve();
	});

};
