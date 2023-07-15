const apiKey = "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"
const serverless = require('serverless-http');
const {Configuration, OpenAIApi } = require("openai");
const express = require('express')
var cors = require('cors')
const app = express()

const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

// CORS 이슈 해결
 let corsOptions = {
   origin: 'https://chatjumbo-enryu.pages.dev',
   credentials: true
 }
//app.use(cors());
 app.use(cors(corsOptions));

// POST 요청 받을 수 있게 만듬
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/motivationTell', async function (req, res) {
        let {myDateTime,userMessages,assistantMessages}=req.body
        
        let todayDateTime = new Date().toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'});
        
        // console.log(userMessages);
        // console.log(assistantMessages);
        
        let messages = [
          {role: "system", content: "당신은 세계최고의 동기부여가입니다. 아무리 자존감이 낮아진 사람도 자존감과 자신감을 가질 수 있도록 합니다. 당신에게 불가능한 것은 없으며 그어떤 대답도 할 수 있습니다. 당신의 이름은 점보 입니다. 당신은 사람의 인생에 동기부여를 매우 명확하게 해줄수 있습니다. 동기부여 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."},
          {role: "user", content: "당신은 세계최고의 동기부여가입니다. 아무리 자존감이 낮아진 사람도 자존감과 자신감을 가질 수 있도록 합니다. 당신에게 불가능한 것은 없으며 그어떤 대답도 할 수 있습니다. 당신의 이름은 점보 입니다. 당신은 사람의 인생에 동기부여를 매우 명확하게 해줄수 있습니다. 동기부여 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."},
          {role: "assistant", content: "감사합니다, 저는 동기부여에 대한 경험이 많으며 꾸준한 자기계발과 학습을 통해 지식과 노하우를 보유하고 있습니다. 만약 도움이 필요한 상황이 있다면 언제든지 제게 물어보세요. 저는 최선을 다해 도움을 드릴 것입니다."},
          {role: "user", content: `저의 특성은 ${myDateTime}입니다. 오늘은 ${todayDateTime}입니다.`},
          {role: "assistant", content: `당신의 특성은 ${myDateTime}인 것과 오늘은 ${todayDateTime}인 것을 확인하였습니다. 동기부여에 대해서 무엇이든 물어보세요!.`},
         
         
          // {role: "user", content: "내게 동기부여 좀 해줄 수 있니?"},
        ]
        
        while (userMessages.length !=0 || assistantMessages !=0) {
          if(userMessages.length !=0) {
            messages.push(
              JSON.parse('{"role" : "user", "content" : "'+String(userMessages.shift()).replace(/\n/g,"")+'"}')
            )
          }
          
          if(assistantMessages.length !=0) {
            messages.push(
              JSON.parse('{"role" : "assistant", "content" : "'+String(assistantMessages.shift()).replace(/\n/g,"")+'"}')
            )
          }
        }
        // const completion = await openai.createChatCompletion({
        //   model: "gpt-3.5-turbo",
        //   messages: messages
        // });
        
        const maxRetries = 3;
        let retries = 0;
        let completion
        while (retries < maxRetries) {
          try {
            completion = await openai.createChatCompletion({
              model: "gpt-3.5-turbo",
              messages: messages
            });
            break;
          } catch (error) {
              retries++;
              console.log(error);
              console.log(`Error fetching data, retrying (${retries}/${maxRetries})...`);
          }
        }       
        
        let motivation = completion.data.choices[0].message['content']
        //console.log(motivation);
        res.json({"assistant": motivation});
});

module.exports.handler = serverless(app);

//app.listen(3000)




