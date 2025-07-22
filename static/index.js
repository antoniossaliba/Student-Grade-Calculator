import express from "express"
import { fileURLToPath } from "url"
import { dirname } from "path"
import bodyParser from "body-parser"

let map = new Map();

const app       = express();
const PORT      = 5000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const path      = __dirname.substring(0, 81);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {

    res.sendFile(path + "\\templates\\index.html");

});

app.post("/", (req, res) => {

    res.sendFile(path + "\\templates\\grades.html");

});

app.post("/add-grade", (req, res) => {

    let innerMap = new Map();
    
    innerMap.set("grade", req.body.grade);
    innerMap.set("total_grade", req.body.total_grade);
    map.set(req.body.material, innerMap);

    res.redirect("/");

});

app.get("/grades", (req, res) => {

    let materials       = [];
    let grades          = [];
    let total_grades    = [];

    for (const [key, value] of map.entries()) {

        materials.push(key);
        
        for (const [k, v] of value.entries()) {

            if (k === "grade") {

                grades.push(v);

            } else {

                total_grades.push(v);

            }

        }

    }

    res.render(path + "\\templates\\grades.ejs", { materials: materials, grades: grades, total_grades: total_grades });

});

app.get("/calculations", (req, res) => {

    let totalMarks      = 0;
    let marksObtained   = 0;
    let percentage      = 0;

    for (const [key, value] of map.entries()) {

        for (const [k, v] of value.entries()) {

            if (k === "grade") {

                marksObtained += parseInt(v);

            } else {

                totalMarks += parseInt(v);

            }

        }

    }

    if (totalMarks === 0 && marksObtained !== 0) {

        percentage = 0;

    } else if (totalMarks !== 0 && marksObtained === 0) {

        percentage = 0;

    } else {

        percentage = (totalMarks / marksObtained) * 100;

    }

    res.render(path + "\\templates\\index.ejs", { totalMarks: totalMarks, marksObtained: marksObtained, percentage: percentage });

});

app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);

});