 import * as fs from 'fs'

//const path = './database/githubnotes.json'

const notes=[]

fs.writeFileSync('githubnotes.json', JSON.stringify(notes), "utf-8")
//if (path) {
  const note = () => {
    let rawdata = fs.readFileSync('./database/githubnotes.json');
    let notes = JSON.parse(rawdata).data;
    return notes
  }

  //funzione che ordina le note per data dalla più recente
  const ordinamentoData = (a, b) => {
    return new Date(b.date).valueOf() - new Date(a.date).valueOf();
  }

  const noteOrdinate = () => {
    const noteOrdinate = note().sort(ordinamentoData)
    return noteOrdinate
  }

  const n = noteOrdinate()

  let nuoveNotes = n.map((n) => {
    const { id, user, date, title, body } = n
    return { id, user, date, title, body }

  })
//}

