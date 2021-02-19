/**
 * [Open source] Vietnam nCoV Api
 * Author: Vy Nghia 
 **/

const
    axios = require('axios'),
    https = require('https'),
    { parse } = require('node-html-parser'),
    config = {
        method: 'get',
        url: 'https://ncov.moh.gov.vn/',
        headers: {},
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    },
    MAP_KEY = require("./map_key")

function nCoV(callback = () => { }) {
    var nCoV_Result = []

    axios(config).then(function (response) {
        const
            root = parse(response.data)

        const
            dataFind = response.data.match(/(?<=var data =)(.*)(?=;)/g),
            finalData = JSON.parse(dataFind[0])

        for (let d of finalData) {
            const map = MAP_KEY.find(x => x.key == d["hc-key"])

            if(map) {
                nCoV_Result.push({
                    city: map.name,
                    case: d.value,
                    testing: d.socadangdieutri,
                    recovered: d.socakhoi,
                    death: d.socatuvong
                })
            }
        }

        callback(nCoV_Result)
    }).catch(function (error) {
        console.log(error)
        callback(null)
    })
}

nCoV(data => {
    // All
    console.log(data)

    // Custom
    console.log(data.find(x => x.city == "Hồ Chí Minh"))
})
