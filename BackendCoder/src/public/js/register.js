const form = document.getElementById('registerForm');

form.addEventListener('submit',e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    try{
        fetch('http://localhost:8080/sessions/register',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>result.json()).then(json=>console.log(json));
    }catch(e){
        console.log("error", e)
    }
    
})