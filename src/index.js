import app from './server.js'
import connection from './database.js'

const PORT = process.env.PORT || app.get('port'); 

app.listen(PORT, () => {
    console.log(`Server ok on https://tesis-agutierrez-jlincango-aviteri.onrender.com/ (PORT: ${PORT})`);
});

connection();