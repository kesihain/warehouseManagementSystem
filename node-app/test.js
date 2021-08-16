const CryptoJS = require('crypto-js')
require('dotenv').config()


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

// LOGIN
// const request = {
//     name: 'purchaser',
//     password: '123'
// }
console.log(JSON.parse(decrypt('53616c7465645f5fe3a772352e98b324632e6111baf5dd0397be57037cb997ee0459e438f7edc60df1d6604f26912f531f8d8b5d7ffa12cdde9751ae4b2ec06125ff3032af202ef1e0351957099f85e2c86f3bdb21dbe64c1ab7ea4cf27453f4f7fed862c1ed0552924c6b8cc5980745749bd2a0680037f828114832ee5ef0477dfc11c2de09572d0731b7f95f4422d7df53b55f82b11030daec912f1d91ede6441dfe362670e5d815b11813ee9d720b')))


// LOGOUT

let request = {
    token: '02bc733d-0ef7-497a-954e-6f1ccc4b58b9',
    userId: '33dfd612-2db7-452c-8948-673d651daa71'
}


// Add purchase
request = {
    userId: '02bc733d-0ef7-497a-954e-6f1ccc4b58b9',
    token: '33dfd612-2db7-452c-8948-673d651daa71',
    vendorName: 'Test Vendor',
    totalAmount: 10000
}


console.log(encrypt(JSON.stringify(request)))