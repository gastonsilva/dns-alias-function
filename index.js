const { Storage } = require('@google-cloud/storage');
const { DNS } = require('@google-cloud/dns');
const dns = require('dns');

const storage = new Storage();
const cdns = new DNS();

exports.updateRecords = (req, res) => {
    const bucket = storage.bucket(req.body.bucket);
    const fileName = req.body.fileName;
    const remoteFile = bucket.file(fileName);
    console.log('Reading configuration');
    var file = remoteFile.createReadStream();
    var buf = '';
    file
        .on('data', d => { buf += d; })
        .on('end', () => {
            config = JSON.parse(buf);
            for (var i = 0; i < config.rules.length; i++) {
                var rule = config.rules[i];
                dns.resolve4(rule.host, (err, addr) => {
                    if (!err) {
                        var bExists = false;
                        addr.sort();
                        var zone = cdns.zone(rule.zone);

                        const newARecords = [zone.record('A', {
                            name: rule.name,
                            data: addr,
                            ttl: req.body.ttl
                        })];

                        zone.getRecordsStream({ type: 'A', name: rule.name })
                            .on('error', console.error)
                            .on('data', r => {
                                bExists = true;
                                r.data.sort();

                                if (r.data.length != addr.length || !r.data.every((v, i) => v === addr[i])) {
                                    console.log(`Updating DNS A record: ${rule.name}`);
                                    zone.replaceRecords('A', newARecords, (err, change, apiResponse) => {
                                        if (!err) console.log('Updated successfully');
                                        else console.error(err);
                                    });
                                }
                                else
                                    console.log('Nothing to update');
                            })
                            .on('end', () => {
                                if (!bExists)
                                    zone.createChange({
                                        add: newARecord
                                    }, (err, change, apiResponse) => {
                                        if (err) console.error(err);
                                    });
                                res.send();
                            })
                    }
                });
            }
        })
};
