const axios = require('axios')
const xmlParser = require('fast-xml-parser')

exports.post = ('/', (req, res) => {
    calculaFrete(req, res)
})

const URL_BASE = parametros => `http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?${parametros}&nCdEmpresa=&sDsSenha=&sCdMaoPropria=n&nVlValorDeclarado=0&sCdAvisoRecebimento=n&StrRetorno=xml&nIndicaCalculo`

const calculaFrete = async (req, res) => {
    try {
        const {origem, destino, altura, largura, comprimento, peso, formato, diametro} = req.body
        //04014 = SEDEX à vista
        //04510 = PAC à vista
        let fretes = []
        fretes.push({valor: 0, prazo: 0, tipo: 'Combinar com o vendedor'})
        let servicos = ['04014', '04510']
        for (let i = 0; i < servicos.length; i++) {
            let parametros = `sCepOrigem=${origem}&sCepDestino=${destino}&nVlPeso=${peso}&nCdFormato=${formato}&nVlComprimento=${comprimento}&nVlAltura=${altura}&nVlLargura=${largura}&nVlDiametro=${diametro}&nCdServico=${servicos[i]}`
            let config = {method: 'get', url: URL_BASE(parametros)}
            let response = await axios(config)
            const {Servicos: {cServico: {Valor, PrazoEntrega}}} = converterXml(res, response.data)
            fretes.push({
                valor: parseFloat(Valor),
                prazo: PrazoEntrega,
                tipo: servicos[i] === '04014' ? 'SEDEX' : 'PAC'
            })
        }
        res.status(200).send({returnCode: 1, data: fretes})
    } catch (e) {
        res.status(500).send({returnCode: 0, message: e.message})
    }
}

const converterXml = (res, data) => {
    try {
        return xmlParser.parse(data)
    } catch (e) {
        res.status(500).send({returnCode: 0, message: e.message})
    }
}




