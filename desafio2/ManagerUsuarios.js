import fs from 'fs'
 
const path='./files/usuarios.json'
 
export default class ManagerUsuarios{
    consultarUsuarios= async()=>{
        if(fs.existsSync()){
            const data=await fs.promises.readFile(path,'utf-8')
            console.log(data)
            const users=JSON.parse(data)
            return users
        }else{
            return []
        }
    }
 
    crearUsuario= async(info)=>{
        const users=await this.consultarUsuarios()
        if(users.length==0){
            info.id=1
        }else{
            info.id=users[users.length-1].id+1
        }
        users.push(info)
        await fs.promises.writeFile(path,JSON.stringify(users,null,'\t'))
        return info
    }
}
 
const manager = new ManagerUsuarios();
 
const env = async() =>{
    let primeraConsultaUsuarios = await manager.consultarUsuarios();
    console.log(primeraConsultaUsuarios); //Debe devolver vacío
    let user = {
        nombre:"Mauricio",
        apellido:"Espinosa",
        edad:26,
        curso:"Backend"
    }
    let result = await manager.crearUsuarios(user);
    console.log(result); //Debe devolver al usuario con un id
    let segundaConsultaUsuarios = await manager.consultarUsuarios();
    console.log(segundaConsultaUsuarios); //Debe devolver al usuario instertado
}
env();