function debounce(fn,delay,...args){
    if(typeof fn !== "function"){
        throw new Error("first argument of debounce must be a function type")
    }
    var timerId;
    return function(...args2){
        clearTimeout(timerId);
        const myThis = this;
        timerId=setTimeout(function(){
            fn.apply(myThis,[...args2,...args]);
        },delay)
    }
}

var obj = {name:"hello"}
const inputHandler=debounce(function(e){
        console.log(e.target.value,this.name)
},300).bind(obj)

