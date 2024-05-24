import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3001;
const __dirname = path.resolve();
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

const bookBikeModule = function () {
  let buildTimeOut = (bikeId) => {
    return {
      state: 0,
      finished: 0,
      startTimeOut: function () {
        this.state = 1
        setInterval(() => {
          this.finished = 1
          if (bikesTimeouts[bikeId - 1].finished == 1) {
            let numProms = 0;
            let promIndex = 0;
            promises[bikeId - 1].forEach((prom, ind) => {
              if (prom != null) {
                numProms++;
                promIndex = ind;
              }
            })
            if (numProms == 1) {
              resolveFunctions[bikeId - 1][promIndex]('booked')
            }
          }
        }, 5000)
      }
    }
  }

  let bikesTimeouts = [buildTimeOut(1), buildTimeOut(2), buildTimeOut(3), buildTimeOut(4), buildTimeOut(5)]

  let promises = Array(5).fill().map(() => Array(5).fill(null));
  let rejectFunctions = Array(5).fill().map(() => Array(5).fill(null));
  let resolveFunctions = Array(5).fill().map(() => Array(5).fill(null));

  let bookBike = (bikeId, slotId) => {
    promises[bikeId - 1][slotId - 1] = new Promise((resolve, reject) => {
      rejectFunctions[bikeId - 1][slotId - 1] = reject;
      resolveFunctions[bikeId - 1][slotId - 1] = resolve;

      if (bikesTimeouts[bikeId - 1].state == 0 && bikeId != slotId) {
        if (bikesTimeouts[bikeId - 1].finished == 1) {
          resolve('booked')
        } else {
          bikesTimeouts[bikeId - 1].startTimeOut()
        }
      } else {
        promises[bikeId - 1].forEach((prom, ind) => {
          console.log(prom, ind, slotId - 1);
          if (prom != null && ind != slotId - 1) {
            if (rejectFunctions[bikeId - 1][ind]) {
              rejectFunctions[bikeId - 1][ind]('rejected');
            }
          }
        })
        reject('rejected')
      }
    })
  }

  return {
    bookBike: bookBike,
    promises: promises,
    rejectFunctions: rejectFunctions,
    resolveFunctions: resolveFunctions,
    bikesTimeouts: bikesTimeouts
  }

}()

app.get('/book', function (req, res) {
  let bikeId = req.query.bikeId
  let slotId = req.query.slotId
  console.log(`bikeId: ${bikeId}, slotId: ${slotId}`);

  bookBikeModule.bookBike(bikeId, slotId)
  //console.log(bookBikeModule.promises);
  console.log(bookBikeModule.promises[bikeId - 1]);
  console.log(bookBikeModule.rejectFunctions);


  bookBikeModule.promises[bikeId - 1][slotId - 1]
    .then((value) => {
      res.write(value)
      res.end()
    })
    .catch((err) => {
      res.write(err)
      res.end()
    })


  //res.write('booked');
  //res.write('rejected');
  //hint: promise.then((value)=>{}).catch((err)=>{}).finally(()=>res.end())


  /*
  // hardcoded response for when bookBike function is not implemented
  const randomBoolean = Math.random() < 0.5;
  setTimeout(()=>{
    res.write(randomBoolean ? 'booked' : 'rejected');
    res.end();
  }, 1000)*/

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));