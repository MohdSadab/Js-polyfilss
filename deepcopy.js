Array.prototype.myFlat = function(depth=Infinity){
    let res=[];
    this.forEach(curr=>{
        if(Array.isArray(curr) && depth>0){
            if(depth!==Infinity){
                depth=depth-1;
            }
           res.push(...curr.myFlat(depth));
        }else{
            res.push(curr);
        }
    })
    return res;
}


// let arr= [1,2,3,4,[[5,6]]];
// let arr2=arr.myFlat(2);


// console.log(arr,arr2)
let obj={
    a:{
        b:{
            c:[[1],2,3,[4,5,6]]
        }
    }
}


function deepCopy(val){

    // val value is primitive data type
    if(["number","string","boolean","undefined"].includes(typeof val) || val===null){
        return val;
    }

    if(Array.isArray(val)){
        return val.map(curr=> deepCopy(curr))
    }

    else{
        return Object.keys(val).reduce((acc,key)=>{
                    acc[key]=deepCopy(val[key]);
                    return acc;
                },{})
    }

}

let arr= [[1,2,3],4,5,6]
let arr2 = deepCopy(arr);
let obj2 = deepCopy(obj);


