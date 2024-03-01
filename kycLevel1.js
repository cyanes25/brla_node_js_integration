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


async function Kyc(cpf, birthDate, fullName) {
    try {
        const timestamp = Date.now().toString();
        const httpMethod = 'POST';
        const endpoint = `/v1/superuser/kyc/pf/level1`;
        const privateKey = readPrivateKey('private_key.pem');
        const body = { cpf, birthDate, fullName };
        const message = timestamp + httpMethod + endpoint + JSON.stringify(body);
        const Signature = signMessage(privateKey, message);

        const response = await axios.post('https://api.brla.digital:5567' + endpoint, body, {
            headers: {
                'X-API-Timestamp': timestamp,
                'X-API-Key': process.env.BRLA_API_KEY,
                'X-API-Signature': Signature,
            },
        });

        return response.status;
    } catch (error) {
        // Retorna o erro
        return error;
    }
}