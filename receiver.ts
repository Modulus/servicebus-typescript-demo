const { ServiceBusClient } = require("@azure/service-bus");

async function main() {
    console.log("hey there!")
    let server = process.env.SERVER

    console.log("Connecting to: "+server)

    while(true){


        const serviceBusClient = new ServiceBusClient(server);
        const receiver = serviceBusClient.createReceiver("messages");
    
        try {
            
           
            const messages = await receiver.receiveMessages(10, {
                maxWaitTimeInMs: 60 * 1000
              });

            if(messages && Array.isArray(messages)){
                for(let message of messages){
                    if( message.hasOwnProperty("body")){
                        console.log("Received: "+ message.body)
                    }
                    else {
                        console.error("Missing body from response!")
                    }
                }
            }
            else {
                console.error("Response was an array...")
            }
            await receiver.close()
            await serviceBusClient.close()
        }
        catch(error){
            console.error("Failed to receive message: "+ error)
            process.exit(1);
        }finally{
            await receiver.close()
            await serviceBusClient.close()
        }
    
    }

}

main().catch((err) => {
    console.log("Error occurred: ", err);
    process.exit(1);
});

