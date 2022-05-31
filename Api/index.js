import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/github/repos/:account", async (req, res) => {
    const account = req.params.account;
    console.log(`GET - /github/repos/${account}`);
    const lang = req.query.lang || "C#";
    const limit = req.query.limit || 5;
    const order = req.query.order || "ASC"

    const ghResponse = await fetch(`https://api.github.com/users/${account}/repos`).then(res=>res.json());

    res.json(
        Array.from(ghResponse)
        .filter( repo => repo.language === lang )
        .sort((a,b) => compareDateStrings(a.created_at,b.created_at) * ((order === "DESC") ? -1 : 1))
        .slice(0,limit)
        .map(repo => ({
            avatar: repo.owner.avatar_url,
            name: repo.full_name,
            description: repo.description ?? "",
            created_at: new Date(repo.created_at).toLocaleDateString(),
            lang: repo.language
        }))
    );
});

function compareDateStrings(dateA, dateB){
    return new Date(dateA).getTime() - new Date(dateB).getTime()
}

const port = process.env.PORT || 3001;
app.listen(port, ()=>{
    console.log("listening to port " + port);
})