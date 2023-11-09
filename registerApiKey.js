const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');
let globalSignature;
let globalJwt; 
// Função para ler chave privada
function readPrivateKey() {
  return fs.readFileSync('private_key.pem', 'utf8');
}

// Função para ler chave pública
function readPublicKey() {
  return fs.readFileSync('public_key.pem', 'utf8');
}

// Função para gerar a assinatura
function signMessage(privateKey, message) {
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(message);
  return sign.sign(privateKey, 'base64');
}


// Função para realizar o login
async function loginUser(email, password) {
    const endpoint = 'https://api.brla.digital:4567/v1/superuser/login';
    const body = { email, password };
  
    try {
      const response = await axios.post(endpoint, body);
      globalJwt = response.data.accessToken; // Armazenando o JWT globalmente
  
      console.log('Login successful! Token:', globalJwt);
    } catch (error) {
      console.error('Error during login:', error.response.data || error.message);
    }
  }

// Função para registrar a chave API
async function registerApiKey(name, privateKeyPath, publicKeyPath) {
  const privateKey = readPrivateKey(privateKeyPath);
  const publicKey = readPublicKey(publicKeyPath);

  const timestamp = Date.now().toString();
  const httpMethod = 'POST';
  const endpoint = 'https://api.brla.digital:4567/v1/superuser/api-keys';
  
  const message = name;

  // Gerando a assinatura
  const signature = signMessage(privateKey, message);
  globalSignature = signMessage(privateKey, message);

  console.log('Generated Signature:', signature); 

  await loginUser("your_email", "your_password")

  const body = {
    name,
    publicKey,
    signature,
  };

  try {
    const response = await axios.post(endpoint, body, {
      headers: {
        'Authorization': `bearer ${globalJwt}`
      },
    });

    console.log('API Key registered successfully:', response.data);
   
  } catch (error) {
    console.error('Error registering API Key:', error.response.data || error.message);
    console.log(body)
  }
}

// Substitua 'nomeDaChave' pelos valores reais
registerApiKey('main', 'public_key.pem', globalSignature);
