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
      startTimeOut: function () {
        this.state = 1
        setTimeout(() => {
          this.state = 0
          bikePromises[bikeId - 1].resolveF('booked')
        }, 5000)
      }
    }
  }

  let bikesTimeouts = [buildTimeOut(1), buildTimeOut(2), buildTimeOut(3), buildTimeOut(4), buildTimeOut(5)]

  const bikePromises =  []

  const _bookBike = (bikeId, slotId) => {
    return new Promise((resolve, reject) => {
      const index = bikeId - 1
      if(bikesTimeouts[index].state == 0) {
        bikesTimeouts[index].startTimeOut()
      } else {
        bikePromises[index].rejectF('rejected')
      }
      bikePromises[index] = {rejectF: reject, resolveF: resolve}
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
  }).catch(error => {
    res.write(error)
  })
  .finally(() => res.end())

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