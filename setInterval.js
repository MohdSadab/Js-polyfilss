const {customSetTimeInterval,customClearTimeInterval}=(function(){

    let timerId=0;  // timer id is for each ssetTimeout function 
    let timerMap = {}  // monitoring whether the timeout is not clear if clear don't call

    function customSetTimeInterval(cb,delay,...args){
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
                    callTime = Date.now(); // reset call time to curr so that curr + delay updated
                    requestIdleCallback(trigger)
                }else{
                    requestIdleCallback(trigger);
                }
            }
            requestIdleCallback(trigger)  // calling trigger function when browser is free;
            return timerId;
    }

    function customClearTimeInterval(id){
        delete timerMap[id];
    }


    return { customClearTimeInterval, customSetTimeInterval};
})();

console.log("hello");

const obj={'name':'sadab'}
const temp = function(...args){
    console.log("temp",args,this.name)
}

customSetTimeInterval(temp.bind(obj),2000,1,2,3,4)

console.log("world");