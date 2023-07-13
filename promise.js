const STATE = {
    PENDING: "pending",
    FULLFILLED: "fullfilled",
    REJECTED: "rejected"
}

class MyPromise{

    #state = STATE.PENDING;
    #thenCbs = [];
    #catchCbs = [];
    #value;
    #onSuccessBind=this.#onSuccess.bind(this);
    #onFailBind=this.#onFail.bind(this);

    constructor(cb){
        try {
            cb(this.#onSuccessBind,this.#onFailBind);
        } catch (error) {
            this.#onFail(error);
        }
    }


    #callPendingCallback(){
        if(this.#state === STATE.FULLFILLED){
             this.#thenCbs.forEach(cb=>{
                cb(this.#value);
             })
             this.#thenCbs = [];
        }

        if(this.#state === STATE.REJECTED){
            this.#catchCbs.forEach(cb=>{
               cb(this.#value);
            })
            this.#catchCbs = [];
       }
    }

    #onSuccess(value){
        // don't call the on success again and again example calling resolve multiple time
        queueMicrotask(()=>{
            if(this.#state !== STATE.PENDING) return;
            if(value instanceof MyPromise){
                value.then(this.#onSuccessBind,this.#onFailBind);
                return;
            }
            this.#state = STATE.FULLFILLED;
            this.#value = value;
            this.#callPendingCallback();
        })
    }

    #onFail(value){
        queueMicrotask(()=>{
            if(this.#state !== STATE.PENDING) return;
            if(value instanceof MyPromise){
                value.catch(this.#onSuccessBind,this.#onFailBind);
                return
            }
            this.#state = STATE.REJECTED;
            this.#value = value;
            this.#callPendingCallback();
        })
    }

    then(thenCb,errorCb){
        return new MyPromise((resolve,reject)=>{
           // we are pushing the callback inside then callbacks array which is called at the end or inside the success function 
           this.#thenCbs.push(result=>{
               if( thenCb == null){
                    //  resolve the promise if the promise does not have then or then does not have cb 
                    // example mypromise.then().catch(error=>error).then(res=>res);
                    resolve(result);
                    return;
               }
               try {
                    resolve(thenCb(result));
               } catch (error) {
                    reject(error)
               }
           })

           this.#catchCbs.push(result=>{
                if( errorCb == null){
                    // reject the promise if the promise does not have catch or catch after a then 
                    //  example p.then()  or p.then(cb).catch() 
                    // no callback means we have not catch the error yet need to propagate it that is why we reject it 
                    // example p.then(cb).catch(empty no callback).catch(error=>error(i will handle the error))
                    // const p = new MyPromise((resolve,reject)=>{
                    //     reject("Hello");
                    // })
                    // p.then(result=>result+"temp").catch().catch(error=>error+" djkhdj").then(error=>console.log(error,">>"))
                    reject(result);
                    return;
                }
                try {
                    resolve(errorCb(result));
                } catch (error) {
                    reject(error)
                }
            })

            this.#callPendingCallback();
        })
    }

    catch(cb){
        return this.then(null, cb);
    }

    finally(cb){
        return this.then(result=>{
            cb();
            return result;
        },error=>{
            cb();
            throw error;
        })
    }


    static resolve(val){
        return new MyPromise(resolve=>{
            resolve(val)
        })
    }

    static reject(val){
        return new MyPromise((_,reject)=>{
            reject(val)
        })
    }

    static all(promises){
        let results=[];
        return new MyPromise((resolve,reject)=>{
            for(let it=0;it<promises.length;it++){
                if(promises[it] instanceof MyPromise){
                    promises[it].then(res=>{
                        results[it]=res;
                        if(it===promises.length-1){
                            resolve(results);
                        }
                    }).catch(error=>{
                        reject(error);
                    })
                }else{
                    results[it]=promises[it];
                }
            }
        })
    
    }

    static allSettled(promises){
        let results=[];
        return new MyPromise((resolve,reject)=>{
            for(let it=0;it<promises.length;it++){
                if(promises[it] instanceof MyPromise){
                    promises[it].then(res=>{
                        results[it]={
                            state:'fullfilled',
                            value:res
                        };
                    }).catch(error=>{
                        results[it]={
                            state:'rejected',
                            value:error
                        }
                    }).finally(()=>{
                        if(it===promises.length-1){
                            resolve(results);
                        }
                    })
                }else{
                    results[it]={
                        state:'fullfilled',
                        value:promises[it]
                    };
                }
            }
        })
    
    }

    static race(promises){

        return new MyPromise((resolve,reject)=>{
                for(let i=0;i<promises.length;i++){
                    const prom = promises[i];
                    if(promises[i] instanceof MyPromise){
                        prom.then(resolve).catch(reject)
                    }
                }
        })

    }


}

// const p = new MyPromise((resolve,reject)=>{
//     reject("Hello");
// })
// // p.then(cb=>{
// //     console.log(cb);
// // })
// p.then(result=>result+"temp").catch().catch(error=>error+" djkhdj").then(error=>console.log(error,">>"))

const promise1 = MyPromise.reject(3);
const promise2 = 42;
const promise3 = new MyPromise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

// MyPromise.all([promise1, promise2, promise3]).then((values) => {
//   console.log(values,">>>>>>>>");
// }).catch(error=>console.log(error));


// MyPromise.allSettled([promise1, promise2, promise3]).then((values) => {
//     console.log(values,">>>>>>>>");
//   }).catch(error=>console.log(error));

MyPromise.race([promise1, promise2, promise3]).then((values) => {
    console.log(values,">>>>>>>>");
  }).catch(error=>console.log(error));