// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const axios = require("axios");
const { ActivityHandler, MessageFactory } = require('botbuilder');

class MyBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.name = null;
        this.index = null;
        this.specificValue = null;
        this.number = null;
        this.onMessage(async (context, next) => {
            const text = context.activity.text;

            //create an array for valid info of index options
            const validIndex = ["posting type", "level", "Full/Part time", "Salary from", "Salary to"]
            const postingTypeArr = ["Internal", "External"]
            const levelArr = ["0", "1", "2", "3", "4", "4A", "4B", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8"]
            const fpIndicatorArr = ["F", "P"]

            if(this.name === null){
                this.name = text;
                console.log("1. set text as name");
                await context.sendActivity(`Hi, ${this.name}. I am going to ask you serval question to help you find qualify jobs.`);

                await context.sendActivity(`I am able to search by:
                                            \n 1. Posting type;
                                            \n 2. Job Difficulty Level;
                                            \n 3. Full/Part Time Position;
                                            \n 4. Salary From
                                            \n 5. Salary To`);
                await context.sendActivity("how many results you want to get?")
                console.log("2. ask for number of result");
                await next();
            }else if(this.number === null){
              console.log("3.number is empty");
                if (typeof parseInt(text) != "number") {
                  console.log("4. This is not number");
                  await context.sendActivity("Sorry, please enter a number for results.")
                }else{
                  console.log("4. This is number type");
                  //await context.sendActivity(`${this.name}, how many results you want to see?`);
                  //await this.sendSuggestednumber(context);
                  this.number = text;
                  console.log("5. set text as number");
                  console.log("number is equal");console.log(this.number);
                  await context.sendActivity(`You have choose to get ${this.number} of results`);
                  await context.sendActivity(`Next I am going to ask you some questions for me to seach for jobs, enter anything to let me know you are ready:`);
                  //await context.sendActivity("Please choose the search option from above")//can't run the next message autometicly, has enter message to trigger
                }
            
              }else if(this.index === null){
              console.log("index is empty");
                //await this.sendSuggestedActions(context);
                if(validIndex.includes(text)){
                    console.log("text is valid input for index");
                    this.index = text;
                    console.log("set text as index");
                    await context.sendActivity(`${this.name}, you chose to search jobs by ${this.index}`);
                    if(this.index.includes("posting type")){
                      console.log("index is chosen as posting type");
                        await context.sendActivity(`Please enter the specific value of Posting Type
                                                    \n1.Internal;
                                                    \n2.External;`);
                    }else if(this.index.includes("level")){
                      console.log("index is chosen as level");
                        await context.sendActivity(`Please enter the specific value of Job Difficulty Level
                                                    \nNumber from 1~4`);
                    }else if(this.index.includes("Full/Part time")){
                      console.log("index is chosen as full/part time");
                        await context.sendActivity(`Please enter the specific value of Full time/ Part time 
                                                    \n1.F
                                                    \n2.P`);
                    }else if(this.index.includes("Salary from")){
                      console.log("index is chosen as salary from");
                        await context.sendActivity(`Please enter the specific value of Salary Starting point
                                                    \n`);
                    }else if(this.index.includes("salary to")){
                      console.log("index is chosen as salary to");
                        await context.sendActivity(`Please enter the specific value of Salary Maximun
                                                    \n`);
                    }
                
                }else{console.log("text is not a valid input for index, first time always");
                  console.log("ask user to enter again");
                    await context.sendActivity(`Please select a searching option:`);
                    await this.sendSuggestedActions(context);
                }
                
                await next();
                
            }else if(this.specificValue === null){
              console.log("specific value is empty");
                //search by api
                if(this.index == "posting type"){
                    console.log("check input valid posting type");
                    if(postingTypeArr.includes(text)){
                        await context.sendActivity(`${this.name}, here are the top ${this.number} results I found:`)
                        this.specificValue = text;
                        console.log("Posting type api")
                        await context.sendActivity(`You can search these jobs by Job ID on
                                                    \nhttp://www.nyc.gov/html/careers/html/search/search.shtml`);
                        await this.getData1(text,this.number, context);
                        this.index = null;
                        this.specificValue = null;
                        this.number = null;
                        console.log("reset index and specificValue");
                        await this.sendSuggestednumber(context);
                        //await this.sendSuggestedActions(context);
                    }else{ await context.sendActivity(`${this.name}, I don't understand, please enter a valid input.`);}
                }else if(this.index == "level"){
                    console.log("check input valid level");
                    if(levelArr.includes(text)){
                        await context.sendActivity(`${this.name}, here are the top ${this.number} results I found:`)
                        this.specificValue = text;
                        console.log("Level api")
                        await context.sendActivity(`You can search these jobs by Job ID on
                                                    \nhttp://www.nyc.gov/html/careers/html/search/search.shtml`);
                        await this.getData2(text,this.number, context);
                        this.index = null;
                        this.specificValue = null;
                        this.number = null;
                        console.log("reset index and specificValue");
                        await this.sendSuggestednumber(context);
                        //await this.sendSuggestedActions(context);
                    }else{ await context.sendActivity(`${this.name}, I don't understand, please enter a valid input.`);}
                }else if(this.index == "Full/Part time"){
                    console.log("check input valid fp indicator");
                    if(fpIndicatorArr.includes(text)){
                        await context.sendActivity(`${this.name}, here are the top ${this.number} results I found:`)
                        this.specificValue = text;
                        console.log("F/P api")
                        await context.sendActivity(`You can search these jobs by Job ID on
                                                    \nhttp://www.nyc.gov/html/careers/html/search/search.shtml`);
                        await this.getData3(text,this.number, context);
                        this.index = null;
                        this.specificValue = null;
                        this.number = null;
                        console.log("reset index and specificValue");
                        await this.sendSuggestednumber(context);
                        //await this.sendSuggestedActions(context);
                    }else{ await context.sendActivity(`${this.name}, I don't understand, please enter a valid input.`);}
                }else if(this.index == "Salary from"){
                    console.log("check input valid salary from");
                    if(!isNaN(text)){
                        await context.sendActivity(`${this.name}, here are the top ${this.number} results I found:`)
                        this.specificValue = text;
                        console.log("salary from api")
                        await context.sendActivity(`You can search these jobs by Job ID on
                                                    \nhttp://www.nyc.gov/html/careers/html/search/search.shtml`);
                        await this.getData4(text,this.number, context);
                        this.index = null;
                        this.specificValue = null;
                        this.number = null;
                        console.log("reset index and specificValue");
                        await this.sendSuggestednumber(context);
                        //await this.sendSuggestedActions(context);
                    }else{ await context.sendActivity(`${this.name}, I don't understand, please enter a valid input.`);}
                }else if(this.index == "Salary to"){
                    console.log("check input valid salary to");
                    if(!isNaN(text)){
                        await context.sendActivity(`${this.name}, here are the top ${this.number} results I found:`)
                        this.specificValue = text;
                        console.log("salary to api")
                        await context.sendActivity(`You can search these jobs by Job ID on
                                                    \nhttp://www.nyc.gov/html/careers/html/search/search.shtml`);
                        await this.getData5(text,this.number, context);
                        this.index = null;
                        this.specificValue = null;
                        this.number = null;
                        console.log("reset index and specificValue");
                        await this.sendSuggestednumber(context);
                        //await this.sendSuggestedActions(context);
                        
                    }else{ await context.sendActivity(`${this.name}, I don't understand, please enter a valid input.`);}
                }
                
                //await context.sendActivity("What is the next thing you want to searh?")
                
                await next();
            }else{
                await context.sendActivity(`You said '${ text }'`);
                await next();
            }
            
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
        
        

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(`Hello and welcome! My Name is JOB BOT 4900 
                                                \nWhat is your name?`);
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    async sendSuggestedActions(turnContext) {
        var reply = MessageFactory.suggestedActions(
          ["posting type", "level", "Full/Part time", "Salary from", "Salary to"],
          "What do you want to search this time?"
        );
        await turnContext.sendActivity(reply);
    }

    async sendSuggestednumber(turnContext) {
      var reply = MessageFactory.suggestedActions(
        ["1", "2", "3", "4", "5"],
        "How many results you want to search?"
      );
      await turnContext.sendActivity(reply);
  }


    async getData1(type,number, context) {//Posting Type
        const message = await new Promise((resolve, reject) => {
          let url = `https://data.cityofnewyork.us/resource/kpav-sd4t.json?$limit=${number}&posting_type=${type}`;
          console.log(context);
          axios
            .get(url)
            .then(response => {
              // console.log(response.data);s
              let result = [];
              for (let ele in response.data) {
                // console.log(ele);
                result.push({
                    jobId: response.data[ele].job_id,
                    title: response.data[ele].business_title,
                    level: response.data[ele].level,
                    agency: response.data[ele].agency,
                    fp: response.data[ele].full_time_part_time_indicator,
                    from: response.data[ele].salary_range_from,
                    to: response.data[ele].salary_range_to,
                    apply: response.data[ele].to_apply
                });
                
                // console.log(response.data[ele]);
                // return context.sendActivity(message);
              }
    
              // await turnContext.sendActivity(reply)
              resolve(result);
            })
            .catch(err => {
              console.log("there is errr", err);
              // reject(err);
            });
        });
        // console.log("message ", message);
        for (let ele in message) {
            let results = `Job title is ${message[ele].title}
                            \nJob ID: ${message[ele].jobId}
                            \nDiffculty Level: ${message[ele].level}
                            \nAgency:${message[ele].agency}
                            \nFull/Part Time: ${message[ele].fp}
                            \nSalary from:${message[ele].from}
                            \nSalary to:${message[ele].to}
                            \nHow to apply:${message[ele].apply}
                            `;
          await context.sendActivity(results);
        }
      }

      async getData2(type,number, context) {//Job Difficulty Level
        const message = await new Promise((resolve, reject) => {
          let url = `https://data.cityofnewyork.us/resource/kpav-sd4t.json?$limit=${number}&level=${type}`;
          console.log(context);
          console.log("number is put in data2");
          axios
            .get(url)
            .then(response => {
              // console.log(response.data);s
              let result = [];
              for (let ele in response.data) {
                // console.log(ele);
                result.push({
                    jobId: response.data[ele].job_id,
                    title: response.data[ele].business_title,
                    level: response.data[ele].level,
                    agency: response.data[ele].agency,
                    fp: response.data[ele].full_time_part_time_indicator,
                    from: response.data[ele].salary_range_from,
                    to: response.data[ele].salary_range_to,
                    apply: response.data[ele].to_apply
                });
                
                // console.log(response.data[ele]);
                // return context.sendActivity(message);
              }
    
              // await turnContext.sendActivity(reply)
              resolve(result);
            })
            .catch(err => {
              console.log("there is errr", err);
              // reject(err);
            });
        });
        // console.log("message ", message);
        for (let ele in message) {
            let results = `Job title is ${message[ele].title}
                            \nJob ID: ${message[ele].jobId}
                            \nDiffculty Level: ${message[ele].level}
                            \nAgency:${message[ele].agency}
                            \nFull/Part Time: ${message[ele].fp}
                            \nSalary from:${message[ele].from}
                            \nSalary to:${message[ele].to}
                            \nHow to apply:${message[ele].apply}
                            `;
          await context.sendActivity(results);
        }
      }

    async getData3(type,number, context) {//Full time or Part time
        const message = await new Promise((resolve, reject) => {
          let url = `https://data.cityofnewyork.us/resource/kpav-sd4t.json?$limit=${number}&full_time_part_time_indicator=${type}`;
          console.log(context);
          axios
            .get(url)
            .then(response => {
              // console.log(response.data);s
              let result = [];
              for (let ele in response.data) {
                // console.log(ele);
                result.push({
                    jobId: response.data[ele].job_id,
                    title: response.data[ele].business_title,
                    level: response.data[ele].level,
                    agency: response.data[ele].agency,
                    fp: response.data[ele].full_time_part_time_indicator,
                    from: response.data[ele].salary_range_from,
                    to: response.data[ele].salary_range_to,
                    apply: response.data[ele].to_apply
                });
                
                // console.log(response.data[ele]);
                // return context.sendActivity(message);
              }
    
              // await turnContext.sendActivity(reply)
              resolve(result);
            })
            .catch(err => {
              console.log("there is errr", err);
              // reject(err);
            });
        });
        // console.log("message ", message);
        for (let ele in message) {
            let results = `Job title is ${message[ele].title}
                            \nJob ID: ${message[ele].jobId}
                            \nDiffculty Level: ${message[ele].level}
                            \nAgency:${message[ele].agency}
                            \nFull/Part Time: ${message[ele].fp}
                            \nSalary from:${message[ele].from}
                            \nSalary to:${message[ele].to}
                            \nHow to apply:${message[ele].apply}
                            `;
          await context.sendActivity(results);
        }
      }
      
      async getData4(type,number, context) {//Salary From
        const message = await new Promise((resolve, reject) => {
          let url = `https://data.cityofnewyork.us/resource/kpav-sd4t.json?$limit=${number}&salary_range_from=${type}`;
          console.log(context);
          axios
            .get(url)
            .then(response => {
              // console.log(response.data);s
              let result = [];
              for (let ele in response.data) {
                // console.log(ele);
                result.push({
                    jobId: response.data[ele].job_id,
                    title: response.data[ele].business_title,
                    level: response.data[ele].level,
                    agency: response.data[ele].agency,
                    fp: response.data[ele].full_time_part_time_indicator,
                    from: response.data[ele].salary_range_from,
                    to: response.data[ele].salary_range_to,
                    apply: response.data[ele].to_apply
                });
                
                // console.log(response.data[ele]);
                // return context.sendActivity(message);
              }
    
              // await turnContext.sendActivity(reply)
              resolve(result);
            })
            .catch(err => {
              console.log("there is errr", err);
              // reject(err);
            });
        });
        // console.log("message ", message);
        for (let ele in message) {
            let results = `Job title is ${message[ele].title}
                            \nJob ID: ${message[ele].jobId}
                            \nDiffculty Level: ${message[ele].level}
                            \nAgency:${message[ele].agency}
                            \nFull/Part Time: ${message[ele].fp}
                            \nSalary from:${message[ele].from}
                            \nSalary to:${message[ele].to}
                            \nHow to apply:${message[ele].apply}
                            `;
          await context.sendActivity(results);
        }
      }

      async getData5(type,number, context) {//Salary To
        const message = await new Promise((resolve, reject) => {
          let url = `https://data.cityofnewyork.us/resource/kpav-sd4t.json?$limit=${number}&salary_range_to=${type}`;
          console.log(context);
          axios
            .get(url)
            .then(response => {
              // console.log(response.data);s
              let result = [];
              for (let ele in response.data) {
                // console.log(ele);
                result.push({
                    jobId: response.data[ele].job_id,
                    title: response.data[ele].business_title,
                    level: response.data[ele].level,
                    agency: response.data[ele].agency,
                    fp: response.data[ele].full_time_part_time_indicator,
                    from: response.data[ele].salary_range_from,
                    to: response.data[ele].salary_range_to,
                    apply: response.data[ele].to_apply
                });
                
                // console.log(response.data[ele]);
                // return context.sendActivity(message);
              }
    
              // await turnContext.sendActivity(reply)
              resolve(result);
            })
            .catch(err => {
              console.log("there is errr", err);
              // reject(err);
            });
        });
        // console.log("message ", message);
        for (let ele in message) {
            let results = `Job title is ${message[ele].title}
                            \nJob ID: ${message[ele].jobId}
                            \nDiffculty Level: ${message[ele].level}
                            \nAgency:${message[ele].agency}
                            \nFull/Part Time: ${message[ele].fp}
                            \nSalary from:${message[ele].from}
                            \nSalary to:${message[ele].to}
                            \nHow to apply:${message[ele].apply}
                            `;
          await context.sendActivity(results);
        }
      }

    

}

module.exports.MyBot = MyBot;
