import express from 'express';
import path from 'path';
import cors from 'cors';
import { finished } from 'stream';

const app = express();
const port = 3001;
const __dirname = path.resolve();
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

const bookBikeModule = function () {
  let buildTimeOut = (bikeId) => {
    return {
      state: 0,
      startTimeOut: function () {
        this.state = 1
        setTimeout(() => {
          lastPromiseResolve[bikeId-1]('booked')
          lastPromiseReject[bikeId-1] = null
          lastPromiseResolve[bikeId - 1] = null
        }, 5000)
      }
    }
  }

  let bikesTimeouts = [buildTimeOut(1), buildTimeOut(2), buildTimeOut(3), buildTimeOut(4), buildTimeOut(5)]

  let lastPromiseReject = [null, null, null, null, null]
  let lastPromiseResolve = [null, null, null, null, null]

  let _bookBike = (bikeId, slotId) => {
    return new Promise((resolve, reject) => {

      if(bikesTimeouts[bikeId -1].state == 0) {
        bikesTimeouts[bikeId-1].startTimeOut()
        lastPromiseReject[bikeId - 1] = reject
        lastPromiseResolve[bikeId - 1] = resolve
      } else {
        lastPromiseReject[bikeId - 1]('rejected')
        lastPromiseReject[bikeId - 1] = reject
        lastPromiseResolve[bikeId - 1] = resolve
      }
    })
  }

  return {
    bookBike: _bookBike,
  }

}()

app.get('/book', function (req, res) {
  //if(typeof bookBikeModule != 'undefined') {

  bookBikeModule.bookBike(req.query.bikeId, req.query.slotId)
  .then(response => {
    res.write(response);
    res.end();
  }).catch(error => {
    res.write(error)
    res.end()
  })

  /*
    // hardcoded response for when bookBike function is not implemented
    const randomBoolean = Math.random() < 0.5;
    setTimeout(()=>{
      res.write(randomBoolean ? 'booked' : 'rejected');
      res.end();
    }, 1000)
  }*/


});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));