var util = require('./gamma.js')

exports.profile2score = function(profileArray, tolerance){
	var n=count(profileArray);
	var pLower=array(0);
	var pUpper=array(0);
	for(i=1;i<=n;i++){
		pLower[i]=pLower[i-1]+profileArray[i-1];
		pUpper[i]=pUpper[i-1]+profileArray[n-i];
	}

	var rLower=0;
	var rUpper=0;
	for(i=1;i<=n-1;i++){
		if(pLower[i]>0){
			rLower=rLower+exp( util.log_gamma(i+pLower[i])-util.log_gamma(i+1)-util.log_gamma(pLower[i]));
		}
		if(pUpper[i]>0){
			rUpper=rUpper+exp( util.log_gamma(i+pUpper[i])-util.log_gamma(i+1)-util.log_gamma(pUpper[i]));
		}
	}
	rLower=1-rLower/(n-1);
	rUpper=rUpper/(n-1);

	return (1 - tolerance) * min(array(rLower,rUpper)) + tolerance * max(array(rLower,rUpper));
}

exports.score2rate = function(score, standart, impact){
	if(standart==0 || standart==1 || impact==0 ){
		return 1;
	} elseif (score<(standart/(1-impact*(1-standart)))) {
		return log(1 - score * (1 - impact * (1 - standart)) / standart) / log(impact * (1 - standart));
	}  else {
		return -1;
	}
}

exports.rate2score = function(baseline, rateImpactArray){
	var n=count(rateImpactArray);
	for(i=0;i<=n-1;i++){
		if(rateImpactArray[i][0]==-1){
			baseline=baseline/(1-rateImpactArray[i][1]*(1-baseline));
		}else {
			baseline=baseline*(1-pow((rateImpactArray[i][1]*(1-baseline)), rateImpactArray[i][0]))/(1-rateImpactArray[i][1]*(1-baseline));
		}
	}
	return baseline;
}

exports.scores2score = function(lenience, scoreWeightArray){
	var n=count(scoreWeightArray);
	var min=1;
	var max=1;
	for(i=0;i<=n-1;i++){
		min=min*pow((1-scoreWeightArray[i][0]), scoreWeightArray[i][1]);
		max=max*pow(scoreWeightArray[i][0], scoreWeightArray[i][1]);
	}
	return (1 - lenience) * min + lenience * max;            
}

exports.score2grade = function(score, curvature, polarity, gMin, gMax){
	curvature= pow((1-pow(score, curvature)), (1/curvature));
	g = polarity*curvature+(1-polarity)*(1-curvature);
	return g * gMin + (1-g)*gMax; 
}