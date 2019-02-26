var AWS = require('aws-sdk');
var rek = new AWS.Rekognition();
var sns = new AWS.SNS();

AWS.config.update({region: 'us-east-1'});

exports.handler = (event, context, callback) => {
  console.log('Hello, this is nodejs!');
  // Get the object from the event
  var bucket = event['Records'][0]['s3']['bucket']['name'];
  var imageName = event['Records'][0]['s3']['object']['key'];
  detectLabels(bucket, imageName)
    .then(function(response){
      var params = {
        Message: JSON.stringify(response['Labels']), /* required */
        Subject: imageName,
        TopicArn: 'arn:aws:sns:us-east-1:XXXXXXXXXXXX:extract-imagelabels-sns'
      };
      sns.publish(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); // successful response
      });
    });
  callback(null, 'Hello from Lambda');
};

function detectLabels(bucket, key) {
  let params = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    }
  };
  return rek.detectLabels(params).promise();
}