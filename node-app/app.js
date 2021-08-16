const CryptoJS = require('crypto-js')
require('dotenv').config()
var express = require("express");
const cors = require('cors')
const { Pool } = require('pg')
const { v4: uuidv4 } = require('uuid')
var app = express();
const port = 3001


const encrypt = (text) => {
    let b64 = CryptoJS.AES.encrypt(text, process.env.APP_ID).toString();
    var e64 = CryptoJS.enc.Base64.parse(b64);
    var eHex = e64.toString(CryptoJS.enc.Hex);
    return eHex
}

const decrypt = (cipherText) => {
    let reb64 = CryptoJS.enc.Hex.parse(cipherText);
    let bytes = reb64.toString(CryptoJS.enc.Base64);
    let dec = CryptoJS.AES.decrypt(bytes, process.env.APP_ID);
    let plain = dec.toString(CryptoJS.enc.Utf8);
    return plain
}


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})
pool.connect().then(() => console.log('connected'));
// pool.query('Select * From "public"."user"').then(result => console.log(result))


// User can Login
app.post(`/login`, (req, res) => {
    const params = JSON.parse(decrypt(req.query.request))
    console.log(params)
    console.log(params.name, '=====================================')
    const hashedPassword = CryptoJS.MD5(params.password).toString().toLowerCase()
    console.log(hashedPassword)
    let user;
    pool.query(`
        SELECT * FROM public.user
        WHERE name = $1 AND password = $2
    `, [params.name, hashedPassword]).then(result => {
        console.log(result)
        if (result.rows.length == 1) {
            user = result.rows[0]
        } else {
            res.send('failed: User not found or wrong password')
        }
    }).catch(error => console.log(error)).then(() => {
        const token = uuidv4()
        pool.query(`
        INSERT INTO "userLogin" ("userId","token") VALUES ($1,$2)`, [user.ID, token], (error, result) => {
            if (error) {
                throw error
            }
            const response = {
                message: 'Successfully logged in',
                token: token,
                userId: user.ID,
                role: user.role
            }
            res.send({ response: encrypt(JSON.stringify(response)) })
        })
    })
})

// User Can Logout
app.post('/logout', (req, res) => {
    const params = JSON.parse(decrypt(req.query.request))
    let login;
    pool.query(`
        SELECT * FROM "userLogin" WHERE "token" = $1
    `, [params.token]).then(result => {
        console.log(result)
        login = result.rows[0]
    }).catch(error => { throw error })
        .then(() => {
            if (login) {
                pool.query(`
                DELETE FROM "userLogin" WHERE "token" = $1
            `, [params.token]).then(result => {
                    console.log(result)
                    res.send("Successfully logged out")
                }).catch(error => {
                    throw error
                })
            } else {
                throw 'Not logged in'
            }
        })
})

// Purchaser can log purchases
// Still in progress
// 
// 
app.post('/purchase', (req, res) => {
    const params = JSON.parse(decrypt(req.query.request))

    let login;
    pool.query(`
        SELECT * FROM "userLogin" WHERE "token" = $1
    `, [params.token]).then(result => {
        console.log(result)
        login = result.rows[0]
    }).catch(error => { throw error })
        .then(() => {
            if (login) {
                pool.query(`
                SELECT * FROM public.user WHERE "ID" = $1
            `, [params.userId]).then(result => {
                    console.log(result)
                }).catch(error => { throw error })
                    .then(() => {
                        const purchaseOrderId = uuidv4()
                        pool.query(`
                        INSERT INTO "purchaseOrder" ("vendorName","totalAmount","createUserId","createDate","ID") VALUES ($1,$2,$3,$4,$5)
                    `, [
                            params.vendorName,
                            params.totalAmount,
                            params.userId,
                            new Date(Date.now()).toISOString().replace('T', ' ').replace('Z', ''),
                            purchaseOrderId
                        ]).then(result => {
                            console.log(result)
                            // res.send('Purchase Added')
                        }).catch(error => { throw error })
                            .then(() => {
                                pool.query(`
                                    INSERT INTO "purchaseOrderItem"("ID","name","price","quantity","purchaseOrderId","quantityFilled")
                                    VALUES ($1,$2,$3,$4,$5,$6)
                                `, [
                                    uuidv4(),
                                    params.itemName,

                                ])
                            })
                    })
            } else {
                throw 'Not logged in'
            }
        })
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

// CHECK LOGIN AND ROLE--- Can make decorator instead

// const params = JSON.parse(decrypt(req.query.request))

// let login;
// pool.query(`
//     SELECT * FROM "userLogin" WHERE "token" = $1
// `, [params.token]).then(result => {
//     console.log(result)
//     login = result.rows[0]
// }).catch(error => { throw error })
//     .then(() => {
//         if (login) {
//             pool.query(`
//             SELECT * FROM public.user WHERE "ID" = $1
//         `, [params.userId]).then(result => {
//                 console.log(result)
//             })
//         } else {
//             throw 'Not logged in'
//         }
//     })