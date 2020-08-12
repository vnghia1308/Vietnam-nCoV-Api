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
        url: 'https://ncov.moh.gov.vn/vi',
        headers: {},
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    }


function nCoV(callback) {
    var nCoV_Result = []

    axios(config).then(function (response) {
        const
            root = parse(response.data),
            table = root.querySelector('#sailorTable').toString()
    
        table.match(/<tr[\s\S]*?<\/tr>/g).forEach(tr => {
            if(tr.match(/<td[\s\S]*?<\/td>/g) != null){
                const 
                    data = tr.match(/<td[\s\S]*?<\/td>/g)
                
                nCoV_Result.push({
                    city: data[0].replace(/(<([^>]+)>)/gi, ""),
                    case: data[1].replace(/(<([^>]+)>)/gi, ""),
                    testing: data[2].replace(/(<([^>]+)>)/gi, ""),
                    recovered: data[3].replace(/(<([^>]+)>)/gi, ""),
                    death: data[4].replace(/(<([^>]+)>)/gi, "")
                })
            }
        })
    
        callback(nCoV_Result)
    }).catch(function (error) {
        callback(null)
    })
}

nCoV(data => {
    // All
    console.log(data)

    // Custom
    console.log(data.find(x => x.city == "Hồ Chí Minh"))
})
