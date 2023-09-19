const fs = require("fs");
const http = require("http");
const url = require("url");

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("Error !!!");

//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         "./txt/output.txt",
//         `${data2} \n ${data3} `,
//         "utf-8",
//         (err) => {
//           console.log("File Successfully written");
//         }
//       );
//     });
//   });
// });

/////////////////////////////////////////////////////
//////////////////////SERVER////////////////////////

const replaceTemplate = (temp, item) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, item.productName);
  output = output.replace(/{%ID%}/g, item.id);
  output = output.replace(/{%IMAGE%}/g, item.image);
  output = output.replace(/{%FROM%}/g, item.from);
  output = output.replace(/{%NUTRIENTS%}/g, item.nutrients);
  output = output.replace(/{%QUANTITY%}/g, item.quantity);
  output = output.replace(/{%PRICE%}/g, item.price);
  output = output.replace(/{%DESCRIPTION%}/g, item.description);

  if (!item.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((item) => replaceTemplate(tempCard, item))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }

  //PRODUCT PAGE
  else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  //API
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end("API ");
  }

  //NOT FOUND
  else {
    res.writeHead(404);
    res.end("<h1>Page Not Found !!!</h1>");
  }
});
server.listen(5000, "127.0.0.1", () => {
  console.log("Listening to the server at port 5000");
});
