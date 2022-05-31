const randomWord = async function () {
    // https://rapidapi.com/sheharyar566/api/random-words5/
    const options = {
        method: 'GET',
        url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
        params: {count: '5', minLength: wordGameLength - 1, maxLength: wordGameLength},
        headers: {
            'X-RapidAPI-Host': process.env.APIHOST,
            'X-RapidAPI-Key': process.env.APIKEY
        }
    };

    try {
        const response = await axios.request(options)
        return response?.data.filter(word => word.length === wordGameLength).shift();
    } catch (error) {
        console.error('ERRORE: ', error.response.data.message);
    }
}