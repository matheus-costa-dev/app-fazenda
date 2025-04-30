import { AlertMessage } from "./Alert";
import { Linking, Platform } from 'react-native';


export function isEmailValid(email){
    if (!email || email === ""){
        AlertMessage("Preencha o campo email")
        return false
    }

    if (!email.includes("@") || !email.endsWith(".com")){
        AlertMessage("O email é invalido")
        return false
    }

    return true

}


export function isPasswordValid(password){
    if (!password || password === ""){
        AlertMessage("Preencha o campo senha")
        return false
    }

    const passwordLength = password.length
    if (passwordLength < 6) {
        AlertMessage(`A senha deve ter no minimo 6 caracteres/numeros a que você informou tem ${passwordLength}`)
        return false
    }


    return true

}

export function checkFormAnimal(animal) {
    if (!animal.nome || animal.nome === "") {
        AlertMessage("Preencha o nome do animal");
        return false;
    }
    // if (!animal.especie || animal.especie === "") {
    //     AlertMessage("Preencha a espécie do animal");
    //     return false;
    // }
    if (!animal.peso || animal.peso === "") {
        AlertMessage("Preencha o peso do animal");
        return false;
    }

    if (!(animal.dataNacimento instanceof Date)) {
        AlertMessage("Data de nascimento inválida");
        return false;
    }
    if (animal.cio && !(animal.dataCio instanceof Date)) {
        AlertMessage("Data de cio inválida");
        return false;
    }
    if (animal.prenha && !(animal.dataPrenha instanceof Date)) {
        AlertMessage("Data de prenhez inválida");
        return false;
    }

    if (animal.inseminado) {
        if (!(animal.dataInseminacao instanceof Date)) {
            AlertMessage("Data de inseminação inválida");
            return false;
        }
        if (!(animal.dataConfirmacaoInseminacao instanceof Date)) {
            AlertMessage("Data de confirmação da inseminação inválida");
            return false;
        }
        if (!(animal.dataPrevisaoParto instanceof Date)) {
            AlertMessage("Data de previsão de parto inválida");
            return false;
        }
        if (!animal.tipoInseminacao || animal.tipoInseminacao === "") {
            AlertMessage("Informe o tipo de inseminação");
            return false;
        }
        if (!animal.touroUsadoInseminacao || animal.touroUsadoInseminacao === "") {
            AlertMessage("Informe o touro usado na inseminação");
            return false;
        }
    }

    return true;
}


export function checkFormFarm(farm){

    if (!farm.nome || farm.nome === ""){
        AlertMessage("Preencha o campo nome da fazenda")
        return false
    }

    if (!farm.proprietario || farm.proprietario === ""){
        AlertMessage("Preencha o campo proprietário")
        return false
    }

    if (!farm.endereco || farm.endereco === ""){
        AlertMessage("Preencha o campo endereço")
        return false
    }

    if (!farm.email || farm.email === ""){
        AlertMessage("Preencha o campo email")
        return false
    }

    if (!farm.email.includes("@") || !farm.email.endsWith(".com")){
        AlertMessage("O email é invalido")
        return false
    }

    
    if (!farm.telefone || farm.telefone === ""){
        AlertMessage("Preencha o campo telefone")
        return false
    }


    const phoneNumber = farm.telefone.replace(/\D+/g, '')
    const phoneNumberLength = phoneNumber.length

    if (phoneNumberLength != 9 && phoneNumberLength != 11){
        AlertMessage(`Telefone invalido, deve conter 9 ou 11 caracteres, o que você informou tem ${phoneNumberLength}`)
        return false
    }

    return true

}


export function parseAnimalToSubmit(animal) {
    const animalToSubmit = {
        ...animal,
        peso: checkNumericValues(animal.peso, true), // Converte para float
        dataNacimento: animal.dataNacimento != "" ? animal.dataNacimento.toLocaleDateString() : "",
        dataCio: animal.cio ? (animal.dataCio != "" ? animal.dataCio.toLocaleDateString() : "") : "",
        dataPrenha: animal.prenha ? (animal.dataPrenha != "" ? animal.dataPrenha.toLocaleDateString() : "") : "",
        dataInseminacao: animal.inseminado ? (animal.dataInseminacao != "" ? animal.dataInseminacao.toLocaleDateString() : "") : "",
        dataConfirmacaoInseminacao: animal.inseminado ? (animal.dataConfirmacaoInseminacao != "" ? animal.dataConfirmacaoInseminacao.toLocaleDateString() : "") : "",
        dataPrevisaoParto: animal.inseminado ? (animal.dataPrevisaoParto != "" ? animal.dataPrevisaoParto.toLocaleDateString() : "") : "",
    };

    return animalToSubmit
}


export function checkNumericValues(data, float) {

    const regex = /[0-9.,]+/g
    let num = data.replace(",", ".").match(regex)
    num = float ? parseFloat(num) : parseInt(num)

    if (isNaN(num)) {
        num = 0
    }

    return num
}



export function transformToDate(date) {

    if (!date || date == "") return ""

    if (date instanceof Date) return date;


    const [dia, mes, ano] = date.split("/");
    const data = new Date(ano, mes - 1, dia); // mês começa do 0 (janeiro)
    return data
}




export const openWhatsApp = (phoneNumber) => {

  // Formata o número (remove caracteres não numéricos)
  const formattedNumber = phoneNumber.replace(/[^\d]/g, '');

  // URL do WhatsApp (com ou sem código de país)
  let url = `whatsapp://send?phone=${formattedNumber}`;

  // Se não tiver código de país, adiciona +55 (Brasil) como padrão
  if (!formattedNumber.startsWith('+')) {
    url = `whatsapp://send?phone=+55${formattedNumber}`;
  }

  Linking.openURL(url).catch(() => {
    // Se o WhatsApp não estiver instalado, abre na Play Store/App Store
    Linking.openURL(
      Platform.OS === 'android'
        ? 'https://play.google.com/store/apps/details?id=com.whatsapp'
        : 'https://apps.apple.com/br/app/whatsapp-messenger/id310633997'
    );
  });
};

export const sendEmail = (to) => {
    const subject = 'Assunto do E-mail';
    const body = 'Corpo do e-mail...';
  
    let url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
    // Verifica se é iOS e ajusta para o formato do Mail.app
    if (Platform.OS === 'ios') {
      url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  
    Linking.openURL(url).catch(() => {
      alert('Não foi possível abrir o cliente de e-mail.');
    });
  };


  
  export function formatDate(date) {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês começa em 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export function getBirthEstimate(date, string) {
    // return console.log(date instanceof Date)
    const futureDate = new Date(date)
    futureDate.setDate(futureDate.getDate() + 190) // 190 dias == 6 meses e alguns dias
    const dateString = futureDate.toLocaleDateString()
    return string ? dateString : futureDate

}