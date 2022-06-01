import * as ns from "./services/note.service.js"; 
app.get('/api/notes', function (req, res) {
    res.send(ns.loadNotes())
})
  


  app.get('/api/notes/:uuid', function (req, res)
  {
      res.send('sei arrivato')
  })
  


  app.get('/api/notes?date=2023-10-01', logMiddleware, (request, response) =>
  
      res.send('sei nel progetto forkato')
  )
  
  

  app.get('/api/notes?limit=2', [logMiddleware, authMiddleware],(request, response) =>
  {
      response 
      
          .status(200)
          .json({
              'data': 'Valore',
              'status': 'OK',
              'value': 1
          })
  })
  



  app.get('/api/admin/user-stats/:user', (request, response) =>
  {
      console.error('Errore')
      response
          .status(500)
          .json({
              'success': false,
              'code': 1001,
              'message': 'Risorsa non trovata'
          })
  })




  app.post('/api/notes', (request, response) =>
  {
      console.error('Errore')
      response
          .status(500)
          .json({
              'success': false,
              'code': 1001,
              'message': 'Risorsa non trovata'
          })
  })



  
  app.put('/api/notes/:uuid', (request, response) =>
  {
      console.error('Errore')
      response
          .status(500)
          .json({
              'success': false,
              'code': 1001,
              'message': 'Risorsa non trovata'
          })
  })













