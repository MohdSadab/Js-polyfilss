function throttle(fn,delay,...args){
    if(typeof fn !== "function"){
        throw new Error("first argument of throttle must be a function type")
    }
    let prev=0;
    return function(...args2){
        var now = Date.now();
        const myThis = this;
        if(now-prev>delay){
            prev=Date.now();
            return fn.apply(myThis,[...args,...args2]);
        }
        
    }
}

var obj = {name:"hello"}
const inputHandler=throttle(function(e){
        console.log(e.target.value,this.name)
},300).bind(obj)

