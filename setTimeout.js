const {customSetTimeout,customClearTimeout}=(function(){

    let timerId=0;  // timer id is for each ssetTimeout function 
    let timerMap = {}  // monitoring whether the timeout is not clear if clear don't call

    function customSetTimeout(cb,delay,...args){
            if(typeof cb !== "function"){
                throw new Error("first argument must be a function type")
            }
            timerMap[timerId] = true; // add the current timout to map
            let _myt_id = timerId;  // track own timer id for checking
            timerId++;
            let callTime = Date.now() // time when setTimeout gets called;
            let myThis = this;
            function trigger(){
                if(delay+callTime<Date.now()){
                    if(!timerMap[_myt_id]) return; // if timeout is clear
                    cb.apply(myThis,args);
                }else{
                    requestIdleCallback(trigger);
                }
            }
            requestIdleCallback(trigger)  // requestIdleCallback calling trigger function when browser is free;
            return timerId;
    }

    function customClearTimeout(id){
        delete timerMap[id];
    }


    return { customClearTimeout, customSetTimeout};
})();

console.log("hello");

const obj={'name':'sadab'}
const temp = function(...args){
    console.log("temp",args,this.name)
}

setTimeout(temp.bind(obj),200,"dkjkjdhkj");
customSetTimeout(temp.bind(obj),0,1,2,3,4)

console.log("world");