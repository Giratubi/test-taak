var PassportConfigurator = require('loopback-component-passport').PassportConfigurator; 

module.exports = function(app) {
	/*
	var passportConfigurator = new PassportConfigurator(app);
	var ttl = 60 * 60;
	var options = require('../../provider.json')['ldap'];
	
	options.createAccessToken = async (user) => {
		try {
			var created = await user.accessToken.create({created:new Date(),ttl:ttl});
			return created;
		}catch(result){
			return result.message;
		}
	};

	passportConfigurator.init(false);
	
	passportConfigurator.setupModels({
		userModel:app.model.Users,
		userIdentityModel:app.models.UserIdentity,
		userCrederntialModel:app.models.UserCredential
	});
		
	passportConfigurator.configureProvider('ldap',options);
	*/
}
