import readline from 'readline'

const rl = readline.createInterface({

    input: process.stdin,
    output: process.stdout
})
   rl.question("Digite seu nome aqui: ", (nomeLocatario)=>{
console.log(nomeLocatario)
    rl.question('Digite seu numero de telefone: ', (celLocatario)=>{
     rl.question('Digite seu RG: ', (rgLocatario) =>{
    rl.question('Digite seu CPF: ', (cpfLocatario) => {
    rl.close()

})})})})