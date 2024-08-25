import express from "express";
import routes from "./routes";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use("/api/v1", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
