import fs from 'fs'

const escribir = async ()=>{
    const data = await fs.promises.readFile('package.json', 'utf-8')

    const info = {
        contenidoString: data,
        contenidoObj: JSON.parse(data),
        
    }
    console.log(info)
    await fs.promises.writeFile('./info.json', JSON.stringify(info, null, '\t'))
}

escribir()