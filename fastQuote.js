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

  

async function fastQuote(amount, chain, outputCoin, fixOutput) {
    const timestamp = Date.now().toString();
    const httpMethod='GET'
    const endpoint = `/v1/superuser/fast-quote?operation=pix-to-usd&amount=${amount}&chain=${chain}&inputCoin=BRLA&outputCoin=${outputCoin}&fixOutput=${fixOutput}`;
    const privateKey = readPrivateKey('private_key.pem');
    
    const message = timestamp + httpMethod + endpoint;
    const Signature = signMessage(privateKey, message);
    
    
      try {
    
        const response = await axios.get('https://api.brla.digital:5567'+endpoint, {
          headers: {
            'X-API-Timestamp': timestamp,
            'X-API-Key': process.env.BRLA_API_KEY,
            'X-API-Signature': Signature,
          },
        });
    
        return response.data
      } catch (error) {
        console.error('Error:', error.response.data || error.message);
      
       
      }
    }