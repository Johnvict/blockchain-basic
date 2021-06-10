# Blockchain Basic
 #  About
 
 A web service that allows users to, when invoking an API method (POST), write on a shared log file such that each entry (line) is linked to the previous one using it's hash and a proof of work.

Expected line output CSV (file on server):
`prev_hash,message,nonce`

where: 
- **"prev_hash"** => previous line hash (sha256) in hex format without any separators. (uses random for the first line.
- **message**     => message sent by the user.
- **nonce**: => a number that guarantees that ``sha256(pre_hash + message + nonce`` return a value that matches RegEx('^00.*')`, i.e. starts with two zeroes.



- [Setup Instructions](#setup-instructions)
  - 
    
  Clone this repository With ssh
  ```
    $ git clone git@github.com:Johnvict/blockchain-basic.git 
  ```
  Or With https
  ```
    $ git clone https://github.com/Johnvict/blockchain-basic.git 
  ```
  Navigate to project directory  
  ```
    $ cd blockchain-basic 
  ```


  Install Dependencies 
  ```
    $ npm install 
  ```



- [Get app running](#get-app-running)
  - 
  Run following command to get our mini app running on TypeScript

  ```
   $ npm run dev
  ```
  Or to get our app running on Production JavaScript code


  ```
   $ npm run prod
  ```


- [Make a Request](#make-a-request)
  - 
  -  Make a post request to `http://localhost:3000/create-hash`
  ```
  {
    "message": "Hola! Everyone"
  }
  ```
  - Check the log file at `logs/log-mm-dd-yyyy.csv `to see changes


