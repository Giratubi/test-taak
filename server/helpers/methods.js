'use strict';

const relationMethodPrefixes = [
    'prototype.__findById__',
    'prototype.__destroyById__',
    'prototype.__updateById__',
    'prototype.__exists__',
    'prototype.__link__',
    'prototype.__get__',
    'prototype.__create__',
    'prototype.__update__',
    'prototype.__destroy__',
    'prototype.__unlink__',
    'prototype.__count__',
    'prototype.__delete__',
    'prototype.__updateAttributes__'

    ];

function reportDisabledMethod( model, methods ) {
  
  const joinedMethods = methods.join( ', ' );

  if ( methods.length ) {
    //console.log( '\nRemote methods hidden for', model.sharedClass.name, ':', joinedMethods, '\n' );
  }
}

module.exports = {
  disableAllExcept( model, methodsToExpose ) {
    const
      excludedMethods = methodsToExpose || [];
    var hiddenMethods = [];

    model.disableRemoteMethod('updateAttributes');
    
    if ( model && model.sharedClass ) {
      model.sharedClass.methods().forEach( disableMethod );
      if(model.definition.settings.relations)
      Object.keys( model.definition.settings.relations ).forEach( disableRelatedMethods );
      reportDisabledMethod( model, hiddenMethods );
    }

    function disableRelatedMethods( relation ) {
    
      relationMethodPrefixes.forEach( function( prefix ) {
        var methodName = prefix + relation;

        disableMethod({ name: methodName });
      });
      
    }
    
    function disableMethod( method ) {
      var methodName = method.name;
      if ( excludedMethods.indexOf( methodName ) < 0 ) {
        model.disableRemoteMethodByName( methodName );
        hiddenMethods.push( methodName );
      }
    }
  },
  /**
   * Options for methodsToDisable:
   * create, upsert, replaceOrCreate, upsertWithWhere, exists, findById, replaceById,
   * find, findOne, updateAll, deleteById, count, updateAttributes, createChangeStream
   * -- can also specify related method using prefixes listed above
   * and the related model name ex for Account: (prototype.__updateById__followers, prototype.__create__tags)
   * @param model
   * @param methodsToDisable array
   */
  disableOnlyTheseMethods( model, methodsToDisable ) {
    methodsToDisable.forEach( function( method ) {
      model.disableRemoteMethodByName( method );
    });
    reportDisabledMethod( model, methodsToDisable );
  }
};
