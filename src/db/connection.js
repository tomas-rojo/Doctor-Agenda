const client = require('./client')

exports.connection = async () => {
    try {
        await client.connect();
        return "Connection Success!"
    }
    catch (err){
        return "Connection Failed!"
    }
}
