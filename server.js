const app = require("./main");
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`User service listening on http://localhost:${PORT}`);
});