require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { readFileSync, writeFileSync } = require("fs")

const PORT = process.env.PORT || 3333
const app = express()
app.use(
    cors({
        origin: "https://felina-multisig-wallet-ui.vercel.app/",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        optionSuccessStatus: 200,
    })
)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/api/transactions", (req, res) => {
    try {
        const transactions = JSON.parse(
            readFileSync("./database/transactions.json", {
                encoding: "utf-8",
            })
        )

        res.status(200).json(transactions)
    } catch (error) {
        const e = error.toString()
        res.status(400).json({ message: e, success: false })
    }
})

app.post("/api/transactions", (req, res) => {
    try {
        const transactions = JSON.parse(
            readFileSync("./database/transactions.json", {
                encoding: "utf-8",
            })
        )

        const descriptions = JSON.parse(
            readFileSync("./database/descriptions.json", {
                encoding: "utf-8",
            })
        )

        const transaction = req.body

        const index = transactions.transactionsDetails.findIndex(
            (detail) => detail.id === transaction.id
        )

        const descriptionMatchingId = descriptions.descriptions.find(
            (description) => description.id === transaction.id
        )

        if (index === -1) {
            transactions.transactionsDetails.push({
                ...transaction,
                description: descriptionMatchingId.description
                    ? descriptionMatchingId.description
                    : "Transaction description not avaliable",
            })

            writeFileSync(
                "./database/transactions.json",
                JSON.stringify(transactions)
            )
        }

        res.status(201).json({ message: "Transaction saved", success: true })
    } catch (error) {
        const e = error.toString()
        res.status(401).json({ message: e, success: false })
    }
})

app.put("/api/transactions", (req, res) => {
    try {
        const transactions = JSON.parse(
            readFileSync("./database/transactions.json"),
            {
                encoding: "utf-8",
            }
        )

        const { id } = req.body

        const index = transactions.transactionsDetails.findIndex(
            (detail) => detail.id === id
        )

        transactions.transactionsDetails[index].executed = true

        writeFileSync(
            "./database/transactions.json",
            JSON.stringify(transactions)
        )

        res.status(200).json({
            message: `Transaction ${id} updated`,
            success: true,
        })
    } catch (error) {
        const e = error.toString()
        res.status(400).json({ message: e, success: false })
    }
})

app.get("/api/descriptions", (req, res) => {
    try {
        const descriptions = JSON.parse(
            readFileSync("./database/descriptions.json", {
                encoding: "utf-8",
            })
        )

        res.status(200).json(descriptions)
    } catch (error) {
        const e = error.toString()
        res.status(400).json({ message: e, success: false })
    }
})

app.post("/api/descriptions", (req, res) => {
    try {
        const descriptions = JSON.parse(
            readFileSync("./database/descriptions.json", {
                encoding: "utf-8",
            })
        )

        descriptions.descriptions.push(req.body)

        writeFileSync(
            "./database/descriptions.json",
            JSON.stringify(descriptions)
        )

        res.status(201).json({ message: "Description saved", success: true })
    } catch (error) {
        const e = error.toString()
        res.status(401).json({ message: e, success: false })
    }
})

app.get("/api/nfts", (req, res) => {
    try {
        const nfts = JSON.parse(
            readFileSync("./database/nfts.json", {
                encoding: "utf-8",
            })
        )

        res.status(200).json(nfts)
    } catch (error) {
        const e = error.toString()
        res.status(400).json({ message: e, success: false })
    }
})

app.post("/api/nfts", (req, res) => {
    try {
        const nfts = JSON.parse(
            readFileSync("./database/nfts.json", { encoding: "utf-8" })
        )

        nfts.nfts.push(req.body)
        writeFileSync("./database/nfts.json", JSON.stringify(nfts))

        res.status(201).json({ message: "NFT stored", success: true })
    } catch (error) {
        const e = error.toString()
        res.status(401).json({ message: e, success: false })
    }
})

app.delete("/api/nfts", (req, res) => {
    try {
        const nfts = JSON.parse(
            readFileSync("./database/nfts.json", { encoding: "utf-8" })
        )

        const { nftAddress, tokenId } = req.query

        const index = nfts.nfts.findIndex(
            (nft) => nft.nftAddress === nftAddress && nft.tokenId === tokenId
        )

        if (index != -1) {
            nfts.nfts.splice(index, 1)
            writeFileSync("./database/nfts.json", JSON.stringify(nfts))
        }

        res.status(200).json({ message: "NFT deleted", success: true })
    } catch (error) {
        const e = error.toString()
        res.status(400).json({ message: e, success: false })
    }
})

app.all("*", (req, res) => {
    res.status(404).send("Sorry, this resource doesn't exist")
})

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`))
