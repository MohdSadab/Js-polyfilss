Function.prototype.myBind = function(currThis,...args){

    const myFunc = this; // this represent the current function who calls myBind method
    return function(...args2){
        myFunc.apply(currThis, [...args,...args2])
    }
}


let obj={name:'sss',age:'sjs'};

function temp(...args){
    console.log(this.name,this.age,args)
}

const func=temp.myBind(obj,"world");
func("hello")