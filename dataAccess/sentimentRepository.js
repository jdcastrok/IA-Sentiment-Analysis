var connection = require("./connection.js");


/*
Recupera la colección de stopWords
  Entrada: 
        callback //función a ejecutar tan pronto se tenga una respuesta
  Salida: 
  	JSON que será recibido por el callback. Ejemplo: callback(respuesta)
        {
	success   // éxito: true, fracaso: false
	data        // éxito: array con los documentos de la collección, fracaso: null
	message // éxito: 200, fracaso: 400
        }
*/
exports.getStopWords = function(callback){
	var httpConfig = {
		"uri": "http://localhost:9000/sentimentAnalysis/v1/getCollection/",
		"method": "GET"
	}; 
	var httpData = {
		"collection": JSON.stringify("stopWords")
	};
	connection.httpRequest(httpConfig, httpData, callback);
};


/*
Recupera las colecciones de conocimiento histórico o modelo
  Entrada: 
        knowledgeType, //String, tipo de conocimiento; "Model": colecciones modelo, "Historical": colecciones históricas
        callback //función a ejecutar tan pronto se tenga una respuesta
  Salida: 
  	JSON que será recibido por el callback. Ejemplo: callback(conocimientoSolicitado)

         Éxito: 
         {
	success: false,
	data: {
		"pos" 	// array con los documentos de la colección de conocimiento positivo
		"neg"	// array con los documentos de la colección de conocimiento negativo
	        },
	message: 400
        }
        
        Fracaso: 
        {
	success: false,
	data: null, 
	message: 400
        }
*/
exports.getKnowledgeDB = function(knowledgeType, callback){
	var knowledgeDB = { 
		"pos": [],
		"neg": []
	};
	var httpConfig = {
		"uri": "http://localhost:9000/sentimentAnalysis/v1/getCollection/",
		"method": "GET"
	}; 
	var httpData = {
		"collection": JSON.stringify("positive" + knowledgeType + "Knowledge")
	};
	connection.httpRequest(httpConfig, httpData, 
		function (res) {
			if (res.success) {
				knowledgeDB.pos = res.data;
				httpConfig = {
					"uri": "http://localhost:9000/sentimentAnalysis/v1/getCollection/",
					"method": "GET"
				}; 
				httpData = {
					"collection": JSON.stringify("negative" + knowledgeType + "Knowledge")
				};
				connection.httpRequest(httpConfig, httpData, 
					function (res) {
						if (res.success) {
							knowledgeDB.neg = res.data;
							callback(knowledgeDB);
						} else {
							callback(res);
						}
					});

			} else {
				callback(res);
			}
		}
	);

};




/*
Actualiza  las colecciones de conocimiento histórico o modelo
  Entrada: 
  	knowledgeType, //String, tipo de conocimiento; "Model": colecciones modelo, "Historical": colecciones históricas,

  	knowledgeDB// JSON con los documentos que serán insertados en las colecciónes
  	{
	   "pos" 	// array con los documentos de la colección positiva del conocimiento dado
	   "neg"	// array con los documentos de la colección negativa  del conocimiento dado
	},
        callback //función a ejecutar tan pronto se tenga una respuesta
  Salida: 
  	JSON que será recibido por el callback. Ejemplo: callback(respuesta)
        {
	success   // éxito: true, fracaso: false
	data        // éxito: null, fracaso: null
	message // éxito: 200, fracaso: 400
        }
*/
exports.updateKnowledgeDB = function(knowledgeType, knowledgeDB, callback){
	var httpConfig = {
		"uri": "http://localhost:9000/sentimentAnalysis/v1/updateCollection/",
		"method": "PUT"
	}; 
	var httpData = {
		"collection": JSON.stringify("positive" + knowledgeType + "Knowledge"),
		"documents": JSON.stringify(knowledgeDB.pos)
	};	
	connection.httpRequest(httpConfig, httpData, 
		function (res) {
			if (res.success) {
				httpConfig = {
					"uri": "http://localhost:9000/sentimentAnalysis/v1/updateCollection/",
					"method": "PUT"
				}; 
				httpData = {
					"collection": JSON.stringify("negative" + knowledgeType + "Knowledge"),
					"documents": JSON.stringify(knowledgeDB.neg)
				};
				connection.httpRequest(httpConfig, httpData, 
					function (res) {
						callback(res);
					}
				);

			} else {
				callback(res);
			}
		}
	);
};
