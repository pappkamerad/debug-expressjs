const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const programmingLanguagesRouter = require('./routes/programmingLanguages');

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get('/', (req, res) => {
    let allReqHeaders = '';
    Object.entries(req.headers).forEach(([a, b]) => {
      if (a.startsWith('x-') || a.startsWith('sec-')) {
        return;
      }

      allReqHeaders += `${a}: ${b.replaceAll('"', '\'')}\n`;
    });

    const title = `D: '${req.headers['cache-control']}' / '${req.headers['accept-encoding']}'`;
    const description = allReqHeaders;
    const url = 'https://debug-expressjs.vercel.app';
      
    const html = `
<html>
    <!-- HTML Meta Tags -->
    <title>${title}</title>
    <meta name="description" content="${description}">
  
    <!-- Facebook Meta Tags -->
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
  
    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary">
    <meta property="twitter:domain" content="vercel.app">
    <meta property="twitter:url" content="${url}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
  
    <body>
      <p>Debug Headers:</p>
      <!-- <pre>${allReqHeaders}</pre> -->
      <pre>${JSON.stringify(req.headers, undefined, 2)}</pre>
    </body>

</html>
`;

    //const html = getInfoHtml();
    res.send(html);
    //res.json({ message: 'ok' });
});

app.use('/programming-languages', programmingLanguagesRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });

    return;
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
