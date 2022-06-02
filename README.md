stree# ExpressJs Note APP
Creare un server che permetta di gestire un app di note con [express-js](https://expressjs.com/it/)

### Note:
 * **L'applicativo non deve scrivere in nessun database**, l'aggiunta o cancellazione deve esser **dinamica**.
 * Le response menzionate sotto sono a titolo esemplificativo, _i dati possono cambiare in base allo user_.
 * La struttura delle response deve essere rispettata. Non devono essere inventante nuove chiavi e attenzione agli status code
 * I query params e params devono essere **VALIDATI**
 * Il progetto deve avere un file .env _(ATTENZIONEEE!!!)_
 * Il progetto deve avere un middleware di auth
 * Il progetto deve avere un middleware di log per tracciar e tutte le rotte chiamate (`${method}: ${url} [${time}]`)
 * Il progetto deve prendere i dati delle note dall'api `https://its.dbdevelopment.tech/notes`

### Init del progetto
Ogni utente deve richiedere un `APIKEY` al link `https://its.dbdevelopment.tech/key/{user}`

Per ottenere la chiave bisogna chiamare in `GET` la url `https://its.dbdevelopment.tech/key/@nomeutenteGitHub` con il vostro utente.

_Salvatevi la chiave da usare nella seconda chiamata_.

la response sara:
```json
    {
        "status": "success",
        "data": "chiave-personale-da-usare"
    }
```

Per ottenere il file delle note bisogna chiamare in `POST` la url `https://its.dbdevelopment.tech/notes`
con `payload`
```json
    {
        "user": "@nomeutenteGitHub"
    }
```
e con `header`: 
```json
    {
       "token":  "chiave-personale-da-usare"
    }
```

La chiamata deve salvare il data in `database/githubnotes.json`.

### Rotte da implementare:

* [GET] - `api/notes` - Restituisce tutte le note
   * La rotta **NON** deve essere Autenticata
   * La risposta della rotta deve essere:
    ```json
    {
      "success": true,
      "list": true,
      "data": [
        {
          "id": "e1960fc6-4d45-4b10-a333-7f90041e17c7",
          "user": "spacex",
          "date": "2022-05-20",
          "title": "Corso Node",
          "body": "Crea app Note",
          "created_at": "2022-05-31 09:04:34"
        },
        {
          "id": "8be856f4-67d5-4c3f-95bd-e98e00799bb3",
          "user": "puppy",
          "date": "2022-05-11",
          "title": "Corso Node",
          "body": "Crea app Note",
          "created_at": "2022-05-31 09:04:34"
        }
      ]
    }
    ```
     
* [GET] - `api/notes/:uuid` - Restituisce la nota con uuid passato come parametro
   * La rotta **NON** deve essere Autenticata
   * La risposta della rotta deve essere:
    ```json
    {
      "success": true,
      "single": true,
      "data": [
        {
          "id": "e1960fc6-4d45-4b10-a333-7f90041e17c7",
          "user": "spacex",
          "date": "2022-05-20",
          "title": "Corso Node",
          "body": "Crea app Note"
        }
      ]
    }
    ```
     
* [GET] - `api/notes?date=2023-10-01` - Restituisce tutte le note con data maggiore di `date`
  * La rotta **DEVE** essere Autenticata
  * La risposta della rotta deve essere:
    ```json
    {
      "success": true,
      "filtered": true,
      "data": [
        {
          "id": "e1960fc6-4d45-4b10-a333-7f90041e17c7",
          "user": "spacex",
          "date": "2023-11-20",
          "title": "Corso Node",
          "body": "Crea app Note"
        }
      ]
    }
    ```
    
* [GET] - `api/notes?limit=2` - Restituisce un numero di `limit` note
  * La rotta **DEVE** essere Autenticata
  * Le note devono essere ordinate per data, il limit deve prendere le ultime 2
  * La risposta della rotta deve essere:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "e1960fc6-4d45-4b10-a333-7f90041e17c7",
          "user": "spacex",
          "date": "2022-05-20",
          "title": "Corso Node",
          "body": "Crea app Note"
        },
        {
          "id": "8be856f4-67d5-4c3f-95bd-e98e00799bb3",
          "user": "puppy",
          "date": "2022-05-11",
          "title": "Corso Node",
          "body": "Crea app Note"
        }
      ]
    }
    ```


* [POST] - `api/notes` - Aggiunge una nota
   * La rotta **DEVE** essere Autenticata
   * `id` aka `uuid` **DEVE** essere autogenerato 
   * `id` aka `uuid` **NON DEVE** essere passato nel body 
   * Il body deve essere:
    ```json
    {
          "user": "spacex",
          "date": "2022-05-20",
          "title": "Corso Node",
          "body": "Crea app Note"
    }
    ```
   * la response deve essere l'oggetto creato 
   * lo status code deve essere `201`.

   

* [PUT] - `api/notes/:uuid` - Aggiorna la nota
  * La rotta **DEVE** essere Autenticata
  * **NON** posso aggiornare `data`, `id` aka `uuid` e `user`
  * Il body deve essere:
    ```json
    {
          "title": "Corso Node",
          "body": "Crea app Note"
    }
    ```
  * la response deve essere indentica a quella di  [GET] - `api/notes` con la nuova nota aggiornata 
  * lo status code deve essere `200`.
    

* [GET] - `api/admin/user-stats/:user` - Restituisce tutte le note di un determinato `user`
   * La rotta **DEVE** essere Autenticata
   * La risposta della rotta deve essere:
  ```json
  {
    "success": true,
    "data": [
      {
        "puppy": [
          {
            "date": "2022-05-20",
            "title": "Corso Node",
            "body": "Crea app Note"
          },
          {
            "date": "2022-05-11",
            "title": "Corso Node 1",
            "body": "Crea Note"
          }
        ]
      }
    ]
  }
  ```
  
### Specifiche Generiche da rispettare:
1. Se visito uno rotta non corretta devo ricevere la seguente risposta.
    ```json
    {
        "success": false,
        "code": 1001,
        "error": "Resource not found"
    }
    ```
   con status Code `500`.

2. Se visito una rotta `auth` senza codice auth devo ottenere
    ```json
    {
        "success": false,
        "code": 2001,
        "error": "Unauthorized"
    }
    ```
   con status Code `401`.

3. Se visito una rotta `auth` con codice auth SBAGLIATO devo ottenere
    ```json
    {
        "success": false,
        "code": 2002,
        "error": "Forbidden"
    }
    ```
   con status Code `403`.

### Per installare il progetto:
```bash
npm install
```

### Per usare il server:
```bash
npm start
```
