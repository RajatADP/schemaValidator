const newman = require('newman');

const testFiles = [
    './external-contracts/schema-validator_xyz.json'
];

const testEnvironment = [
    './external-dependencies/schemaValidatorEnv.postman_environment.json',
];

const run = () => {
    for (let index in testFiles) {
        const testFilePath = testFiles[index];
        const testName = testFilePath.substring(testFilePath.lastIndexOf('/')+1, testFilePath.lastIndexOf('.'));
        newman.run({
            collection: require(testFilePath),
            environment: require(testEnvironment[index]),
            reporters: ['htmlextra'],
            reporter: {htmlextra: {
                 export: './newman/'+ testName + '.html',
                 title: testName
            }},
            timeoutScript: 10000,
            timeoutRequest: 10000,
            insecure: true
        }, function (err) {
            if (err) {
                console.log('Failed running tests for collection =>', testFilePath);
                exitCode = 1
            } else {
                console.log('Finished running tests for collection =>', testFilePath);
            }
        }).on('request', function (error, args) {
            if (error) {
                console.error(error);
            }
            else {
                printMessage("RESPONSE",args.response.stream.toString());
            }
        }).on('done', function (err, summary) {
            if (err || summary.error) {
                console.error('collection run encountered an error.');
            }
            console.log('collection run completed.');
            if (summary.run.stats.assertions.failed > 0) {
                console.error('Num of Tests Failed: ',summary.run.stats.assertions.failed);
                console.error('Please look at the reports generated in ./newman folder');
                process.exit(1)
            }
        });
    }
};

const printMessage = (header,message)=>{
    console.log("\n###################",header,"#################");
    console.log(message);
    console.log("##############################################");
}

run();
