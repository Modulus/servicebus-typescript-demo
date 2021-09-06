#!/usr/bin/env node

import axios from "axios"
        
const { ServiceBusClient } = require("@azure/service-bus");



class QuoteClient {
    url: string
    constructor(){
        this.url = "http://loremricksum.com/api/?paragraphs=1&quotes=1"
    }

    async generate() : Promise<any>{

        try {
            const result = axios.get(this.url);
            console.log("Got result")
            return result
        }
        catch(error) {
            console.error("Failed: "+error)
        }

    }
     
}

function unpackMessage(response) : string{
    return response.data.data[0]
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}



async function main() {
    console.log("hey there!")
    
    let client = new QuoteClient()

    let server = process.env.SERVER

    console.log("Connecting to: "+server)

    while(true){
        const serviceBusClient = new ServiceBusClient(server);
        const sender = serviceBusClient.createSender("messages");
        let response = await client.generate();
        const quote = unpackMessage(response)
    
        try {
        
            const message = {
                body: quote
            }
            console.log("\nSending message: "+quote)
            await sender.sendMessages(message)
            console.log("Waiting...")
            await sender.close()
            await serviceBusClient.close()
        }
        catch(error){
            console.error("Failed to sned message: "+ error)
        }finally{
            await sender.close()
            await serviceBusClient.close()
        }
    
        await delay(3000)
    }

}

main().catch((err) => {
    console.log("Error occurred: ", err);
    process.exit(1);
});



