function validator(options){
    const selectorRules={}
    function getElement(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                 return element.parentElement
            }
            element=element.parentElement
        }
    }
    function validate(inputElement,rule){
                    let errorElemnet
                    const rules=selectorRules[rule.selector]
                    for(let i=0;i< rules.length;++i){
                        errorElemnet=rules[i](inputElement.value)
                        if(errorElemnet) break
                    }
                    const messageElement=getElement(inputElement,options.formParent).querySelector(options.formMessage)
                    if(errorElemnet){
                        messageElement.innerText=errorElemnet
                        inputElement.style.border=`1px solid red`
                    }
                    else{
                        messageElement.innerText=''
                        inputElement.style.border=`1px solid #000`
                    }
                    return !errorElemnet
    }
      const formElement=document.querySelector(options.form)
      formElement.onsubmit=function(e){
        e.preventDefault()
        let isFormValid=true
       options.rules.forEach(function(rule){
        const inputElement=formElement.querySelector(rule.selector)
         let isValid =validate(inputElement,rule)
         if(!isValid){
            isFormValid=false
         }
       })
       if(isFormValid){
        if(typeof options.onsubmit === 'function'){
            let enableElement=formElement.querySelectorAll('[name]')
            const toArray=Array.from(enableElement).reduce(function(values,input){
            values[input.name]=input.value
            return values
        },{})
        options.onsubmit(toArray)
        }
       }
      }
      if(formElement){
        options.rules.forEach(function(rule){
            if(Array.isArray(selectorRules[rule.selector])){
                 selectorRules[rule.selector].push(rule.test)
            }
            else{
                selectorRules[rule.selector]=[rule.test]
            }
            const inputElement=formElement.querySelector(rule.selector)
            if(inputElement){
                inputElement.onblur=function(){
                    validate(inputElement,rule)
                }
                inputElement.oninput=function(){
                    const messageElement=getElement(inputElement,options.formParent).querySelector(options.formMessage)
                    messageElement.innerText=''
                    inputElement.style.border=`1px solid #000`
                }
            }
        })
      }
}
validator.isRequied=function(selector){
    return {
         selector:selector,
         test:function(value){
            return value.trim() ? undefined : 'Vui lòng nhập vào trường này' 
         }
    }
}
validator.isEmail=function(selector){
    return {
        selector:selector,
        test:function(value){
            const regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Vui lòng nhập lại trường Email'
        }
    }
}
validator.minLength=function(selector,min){
     return{
        selector:selector,
        test:function(value){
            return value.length >= min ? undefined : `Vui lòng nhập mật khẩu nhỏ hơn ${min}`
        }
     }
}
validator.isConfirmation=function(selector,getConfirm){
      return {
         selector:selector,
         test:function(value){
           return value===getConfirm() ? undefined : 'Vui lòng nhập lại mật khẩu'
         }
      }
}