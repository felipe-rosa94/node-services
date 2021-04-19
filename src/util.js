const nodemailer = require('nodemailer')

exports.mail = (req, res = null) => {
    let remetente = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'Gmail',
        port: 3012,
        auth: {
            user: 'email@gmail.com',
            pass: '123'
        }
    })

    const {to, subject, text} = req.body

    if (!to || !text) {
        if (res) res.status(400).send({returnCode: 0, message: 'Erro! envie os dados corretamente.'})
        return
    }

    let email = {
        from: 'email@gmail.com',
        to: to,
        subject: subject,
        text: text,
    }

    remetente.sendMail(email, function (error) {
        if (error) {
            if (res) res.status(400).send({returnCode: 0, message: error})
        } else {
            if (res) res.status(200).send({returnCode: 1, message: 'Email enviado com sucesso.'})
        }
    })
}
