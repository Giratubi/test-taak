

var process = require('process'); 

var loopback = require('loopback');

var app = module.exports = loopback();

console.log("CAZZO IN CULO")




module.exports = function() {

    console.log("APPENA DENTRO")

    const myTimeout_ = setTimeout(start_, 10000);

    async function start_(){ 
        
        
       // process.send({ counter: 'CIAO CIAO CHILD' });
    
        var Gateway_= app.models
    
        console.log("GATEWAY IN CHILD ",Gateway_)
    
    
        let counter = 0;
    
        await Gateway_.controlTimeOut();
       
    
       /* const controlTimeOutService =  setInterval(Gateway_.controlTimeOut, 180000);
        
        const myTiming = setInterval(Gateway_.serveHandler,20000);
    
        const myTimingAux = setInterval(Gateway_.serveHandlerAux,500);*/
    }

}




/*

module.exports = function() {

    console.log("CAZZO IN CULO 222222")
   
    start_()

    //const myTimeout = setTimeout(start_, 500);

    async function start_(){

        console.log("CIAO CHILD CICCIO")
        process.send({ counter: 'CIAO CIAO CHILD' });

        var loopback = require('loopback');

        var Gateway_= loopback().models.Gateway;
    
        console.log("GATEWAY IN CHILD ",Gateway_)
    
    
        let counter = 0;

       
    
        const controlTimeOutService =  setInterval(Gateway_.controlTimeOut, 180000);
        
        const myTiming = setInterval(Gateway_.serveHandler,20000);
    
        const myTimingAux = setInterval(Gateway_.serveHandlerAux,500);
    }


    

};*/





