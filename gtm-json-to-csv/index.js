const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Specify the directory you want to read from
const dirPath = '##Specify your directory##';

function parseJson(json) {
    // The parsed data will be stored in this array
    let data = [];

    // Loop through all the tags in the JSON
    for (let tag of json.containerVersion.tag) {
        let entry = {
            tagName: tag.name,
            tagType: tag.type
        }

        // Extract the appropriate pixel ID based on the tag type
        switch (tag.type) {
            case 'cvt_31470972_1292'://facebook pixel
                entry.pixelId = tag.parameter.find(p => p.key === 'pixelId').value;
                break;
            case 'awj': //awin
                entry.pixelId = tag.parameter.find(p => p.key === 'merchantId').value;
                break;
            case 'img': //custom image
                entry.pixelId = tag.parameter.find(p => p.key === 'url').value;
                break;
            case 'flc':
                entry.pixelId = tag.parameter.find(p => p.key === 'advertiserId').value;
                break;
            case 'pntr': //pinterest
                entry.pixelId = tag.parameter.find(p => p.key === 'tagId').value;
                break;
            case 'awct': //google ads counter
                entry.pixelId = tag.parameter.find(p => p.key === 'conversionId').value;
                break;
            case 'twitter_website_tag': //twitter
                entry.pixelId = tag.parameter.find(p => p.key === 'twitter_pixel_id').value;
                break;   
            case 'googtag': //new google tag
                entry.pixelId = tag.parameter.find(p => p.key === 'tagId').value;
                break;
            case 'cvt_31470972_3120': //tiktok
                    entry.pixelId = tag.parameter.find(p => p.key === 'pixel_code').value;
                    break;   
            case 'sp': //Google Ads Remarketing
                    entry.pixelId = tag.parameter.find(p => p.key === 'conversionId').value;
                    break;  
            case 'tdsc': //tradedoubler
                    entry.pixelId = tag.parameter.find(p => p.key === 'tduid').value;
                    break;    
            case 'cvt_31470972_676': //adform
                    entry.pixelId = tag.parameter.find(p => p.key === 'trackingId').value;
                    break;                

            default:
                entry.pixelId = 'Unknown';
        }

        data.push(entry);
    }

    return data;
}


function writeCsv(data) {
    const csvWriter = createCsvWriter({
        path: 'out.csv',
        header: [
            {id: 'tagName', title: 'TAG NAME'},
            {id: 'tagType', title: 'TAG TYPE'},
            {id: 'pixelId', title: 'PIXEL ID'},
        ]
    });

    csvWriter.writeRecords(data)
        .then(() => {
            console.log('...Done');
        });
}


fs.readdir(dirPath, (err, files) => {
    if (err) throw err;
    
    // Sort the files in alphabetical order
    files.sort();

    // Select the first file in the sorted array
    const firstFile = files[0];

    // Construct the full path to the first file
    const filePath = path.join(dirPath, firstFile);

    fs.readFile(filePath, (err, fileData) => {
        if (err) throw err;
        let json = JSON.parse(fileData);
        let data = parseJson(json);
        writeCsv(data);
    });
});


