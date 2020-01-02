function Coroutine(interval) {
	var corThis = this;
	if (!interval)
		interval = 50;
	this.Interval = interval;
	this.mCoroutineHost = null;
	this.Iter = null;
	this.Queue = [];
	this.QueueWorkingItem = function (iter) {
		function NewChainedIterator(nextIter){
			if(nextIter.constructor.name == "GeneratorFunction"){
				nextIter=nextIter();
			}
			nextIter.ChainedJob=[];
			nextIter.then=function(value){
				var ret= NewChainedIterator(value);
				nextIter.ChainedJob.push(ret);
				return ret;
			}
			return nextIter;
		}
		if (iter.constructor.name == "GeneratorFunction") {
			var iterator=iter();
			corThis.QueueWorkingItem(iterator);
			return iterator;
		} else {
			if (iter != null && ("next" in iter)) {
				iter.ChainedJob=[];
				iter.then=function(nextIter){
					var ret= NewChainedIterator(nextIter);
					iter.ChainedJob.push(ret);
					return ret;
				}
				corThis.Queue.push(iter);
			}
		}
		if (corThis.Iter == null) {
			corThis.Start();
		}
		return iter;
	};
	this.Runner = function () {
		if (corThis.Iter == null) {
			corThis.Iter = (function  * () {
				var done = [];
				for (var i = 0; i < corThis.Queue.length; ++i) {
					var job = corThis.Queue[i];
					if (job != null) {
						if (job.next().done) {
							done.push(i);
						}
					}
					yield true;
				}
				var nextQueue = [];
				for (var i = 0; i < done.length; ++i) {
					var idx = done[i];
					var selected = corThis.Queue[idx];
					if(selected.ChainedJob && selected.ChainedJob.length > 0){
						for(var j=0; j<selected.ChainedJob.length; ++j){
							nextQueue.push(selected.ChainedJob[j]);
						}
					}
				}
				for (var i = done.length - 1; i >= 0; --i) {
					var idx = done[i];
					corThis.Queue.splice(idx);
				}
				for(var i=0; i<nextQueue.length; ++i){
					corThis.Queue.push(nextQueue[i]);
				}
				corThis.Iter = null;
			})();
		} else {
			corThis.Iter.next();
		}
	};
	this.Start = function () {
		corThis.Stop();
		corThis.mCoroutineHost = setInterval(corThis.Runner, corThis.Interval);
	};
	this.Stop = function () {
		if (corThis.mCoroutineHost != null) {
			clearInterval(corThis.mCoroutineHost);
			corThis.mCoroutineHost = null;
		}
	};
	return this;
}
