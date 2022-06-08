/*  import * as fs from 'fs'


  const note = () => {
    try {
      
      let rawdata = fs.readFileSync('./database/githubnotes.json');
      let notes = JSON.parse(rawdata).data;
      return notes
    } catch (error) {
      return []
    }
  }

  //funzione che ordina le note per data dalla più recente
  const ordinamentoData = (a, b) => {
    try {
      
      return new Date(b.date).valueOf() - new Date(a.date).valueOf();
    } catch (error) {
      return []
    }
  }

  const noteOrdinate = () => {
    try {
      
      const noteOrdinate = note().sort(ordinamentoData)
      return noteOrdinate
    } catch (error) {
      return []
    }
  }

  const n = noteOrdinate()

  let nuoveNotes = n.map((n) => {
    try {
      const { id, user, date, title, body } = n
      return { id, user, date, title, body }
      
    } catch (error) {
      return []
    }

  })

  export default{
    nuoveNotes
  }

 */