import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const API_KEY = "da8a200c418c520f469d837d200ea99b423ab39068c97053f274999dbd3dbf40";
const API_URL = "https://www.virustotal.com/api/v3"

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.post("/scan-url", async (req, res) => {
    const data = {
        url: req.body.url
    }

    const config = {
        headers : {"x-apikey" : API_KEY},
      
    }

    try {
        const response = await axios.post(API_URL + `/urls?url=${req.body.url}`, {}, config)
        const id = response.data.data.id;
  
        const result = await axios.get(API_URL + `/analyses/${id}`, config)
        const analysis = result.data
        res.render("index.ejs", {analysis: analysis.data.attributes})
    } catch (error) {
        console.log("Error: " + error.message);
        if(error.response){
            console.log("Error response: ", error.response.data)
        }
        res.sendStatus(500)
    }
})

app.listen(port, () => {
    console.log("Server is running on port " + port);
})
