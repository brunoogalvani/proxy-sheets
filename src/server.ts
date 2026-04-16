import express from "express";

const app = express();
app.use(express.json());

app.get("/tickets", async (req, res) => {
    const ticketId = String(req.query.ticket || "");
    const nome = String(req.query.nome || "");
    let query = "";

    try {
        if (ticketId) {
            query = `?search=${encodeURIComponent(JSON.stringify({ ticket: ticketId }))}`;
        } else if (nome) {
            query = `?search=${encodeURIComponent(JSON.stringify({ nome: nome }))}`;
        } else {
            query = "";
        }

        const response = await fetch(
            `https://api.steinhq.com/v1/storages/69dfd5003807a370b04d778e/tickets${query}`
        );

        const data = await response.json();

        res.json({
            mensagem: (ticketId || nome) ? "Tickets filtrados" : "Lista completa",
            retorno: data
        });

    } catch (error) {
        res.status(500).json({
            erro: "Erro ao listar",
            detalhe: error
        });
    }
});

app.post("/tickets", async (req, res) => {

    const { ticket, email, nome } = req.body

    try {
        const response = await fetch(
            "https://api.steinhq.com/v1/storages/69dfd5003807a370b04d778e/tickets",
            {
                method: "POST",
                body: JSON.stringify([{
                    ticket,
                    email,
                    nome
                }])
            }
        )

        const data = await response.json()

        res.json({
            mensagem: "Inserido com sucesso",
            retorno: data
        });
    } catch (error) {
        res.status(500).json({
            erro: "Erro ao inserir",
            detalhe: error
        });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => {
        console.log("Servidor rodando na porta 3000");
    });
}

module.exports = app;
