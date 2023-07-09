Function.prototype.customCall = function(currThis,...args){
    currThis.fnRef = this;
    currThis.fnRef(...args);  // calling the function with curr this refer this of fnref (actual function) to currThis because it is object who is calling the function
}


let obj={name:'sss',age:'sjs'};

function temp(args,args2){
console.log(this.name,this.age,args,args2)
}

temp.customCall(obj,"world","hello");