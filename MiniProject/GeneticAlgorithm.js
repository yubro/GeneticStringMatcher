var utils = require('utility');

var initialPops = new Array(8);

var gen = 1;

var poolOfCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*';

var Target = {
    target:  "AbcdeIsARealName",
};

/*Derived From: https://github.com/subprotocol/genetic-js/blob/master/examples/string-solver.html
 */
function mutationFunction(phenotype) {
    var chance = Math.random();
    if(chance >= 0.5){
    function replaceAt(str, index, character) {
		return str.substr(0, index) + character + str.substr(index+character.length);
	}
    var i = Math.floor(Math.random()*phenotype.length);
    var res = replaceAt(phenotype, i, utils.randomString(1,poolOfCharacters));
	return res;
    }
    else{
        return phenotype;
    }
}

/*Derived From: https://github.com/subprotocol/genetic-js/blob/master/examples/string-solver.html
 */
function crossoverFunction(phenotypeA, phenotypeB) {
    var chance = Math.random();

    if(chance >= 0.5){
	var len = phenotypeA.length;
	var ca = Math.floor(Math.random()*len);
	var cb = Math.floor(Math.random()*len);		
	if (ca > cb) {
		var tmp = cb;
		cb = ca;
		ca = tmp;
	}
		
	var newPhenotypeA = phenotypeB.substr(0,ca) + phenotypeA.substr(ca, cb-ca) + phenotypeB.substr(cb);
	var newPhenotypeB = phenotypeA.substr(0,ca) + phenotypeB.substr(ca, cb-ca) + phenotypeA.substr(cb);
    
        return [ newPhenotypeA , newPhenotypeB ];  
    }
    else{
        return [phenotypeA,phenotypeB];
    }
}

/*Derived From: https://github.com/subprotocol/genetic-js/blob/master/examples/string-solver.html
 */
function fitnessFunction(phenotype) {
    var score = 0;
    var i,j;
	for (i=0;i<phenotype.length;++i) {
		if (phenotype[i] == Target['target'][i]){
			score += 1;
        }
        score += (127-Math.abs(phenotype.charCodeAt(i) - Target["target"].charCodeAt(i)))/60;
        }
    return score;
}

function getOptimalFitness(target){
    return fitnessFunction(target);
}

function generatePopulation(population){
    for(i = 0; i < population.length; i++){
        population[i] = utils.randomString(Target['target'].length,poolOfCharacters);
        //console.log(population[i]);
    }
    return population;
}

function printPopulation(){
    var k;
    var printPops = geneticAlgorithm.scoredPopulation();
    for(k = 0; k < printPops.length; k++){
        console.log ("Sample " + (k+1) + ": " + printPops[k]['phenotype'] + " Score:" + printPops[k]['score']);
    }
}

function diseaseCompetiton(phenotypeA,phenotypeB){
    var chance = Math.random();
    var AChance = fitnessFunction(phenotypeA);
    var BChance = fitnessFunction(phenotypeB);
    if(chance <= 0.33){
        AChance *= Math.Random();
    }
    else if(chance > 0.33 && chance <= 0.66){
        BChance *= Math.Random();
    }
    else{
        AChance *= Math.Random();
        BChance *= Math.Random();
    }

    return AChance >= BChance;
}

var geneticAlgorithmConstructor = require('geneticalgorithm');
var geneticAlgorithm = geneticAlgorithmConstructor({
    mutationFunction: mutationFunction,
    crossoverFunction: crossoverFunction,
    fitnessFunction: fitnessFunction,
    doesABeatBfunction:diseaseCompetiton,
    population: generatePopulation(initialPops),
    populationSize: 98
});

console.log("Starting with:");
console.log( initialPops );
var best;

while(best != Target['target']){
    console.log("Generation " + gen);
    geneticAlgorithm.evolve();
    best = geneticAlgorithm.best();
    printPopulation();
    console.log("Best of This Population" + gen +":, " + geneticAlgorithm.bestScore());
    console.log("Worst of This Population"+ gen+":, "+ geneticAlgorithm.worstScore());
    console.log("Mean "+gen+":, " + geneticAlgorithm.meanPopulation());
    gen++;
}
delete best.score;
console.log("Finished with:");
console.log(best);
console.log("Optimal Fitness:" + getOptimalFitness(Target["target"]));
