const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const _ = require('lodash')
router.use(express.json());
const User = require('../DB/models/users');
const Scr = require('../DB/models/securities')


/**
 * @descr : Buy Stocks :: 
 * body :: accespts ticker, shares and avgBuyPrice
 * Returns success if able to add to DB
 */
router.post('/buyStocks', auth, async (req, res) => {
    console.log('+++++++++++++++++++++++++++++buyStocks+++++++++++++++++++++++++++++')
    console.log(req.body, "BODY requested")
    let { ticker, shares, avgBuyPrice } = req.body
    if (!(ticker && shares && avgBuyPrice)) {
        return res.status(400).send('ticker,shares,avgBuyPrice are required fields')
    }
    if (shares < 0) {
        return res.status(400).send('Share count can not be -ve')
    }
    let email = req.user.email
    let resr = await Scr.findOne({
        email: req.user.email
    });
    console.log(resr,"RESER")
    if (!resr) {
        let src = new Scr({
            email: req.user.email,
            portfolio: [{ ...req.body }],
            history: [{ ...req.body, type: 'BUY' }],
            owner : req.user
        })
        await src.save();
        res.status(201).send(src)
    } else {
        let exportFolio = resr.portfolio;
        let historyOfFolio = resr.history;
        let ifMatch = _.filter(exportFolio, {
            ticker: ticker
        });
        console.log('ifMatch', _.get(ifMatch[0], 'ticker', "****"))
        if (ifMatch.length > 0) {
            let newAVG = ((ifMatch[0].shares * ifMatch[0].avgBuyPrice) + (shares * avgBuyPrice)) / (ifMatch[0].shares + shares);
            let newQTY = ifMatch[0].shares + shares;
            _.remove(exportFolio, {
                ticker: ticker
            })
            pushObj = {
                "ticker": ticker,
                'shares': newQTY,
                'avgBuyPrice': newAVG
            }

        } else {
            pushObj = {
                "ticker": ticker,
                "shares": shares,
                "avgBuyPrice": avgBuyPrice
            }
        }
        historyOfFolio.push({ ...req.body, type: 'BUY' })
        exportFolio.push(pushObj)
        console.log(exportFolio, "UPDATED PORTFOLIO")
        try {
            let response = await Scr.findOneAndUpdate({
                email: email
            }, {
                portfolio: exportFolio,
                history: historyOfFolio
            }, { new: true });
            // await User.save()
            return res.status(201).send(response)
        } catch (e) {
            return res.status(400).send('Some error occured' + e)
        }
    }
    // let exportFolio = req.user.portfolio;
    // let historyOfFolio = req.user.history;
    // let email = req.user.email, pushObj = {};
    // let res =  await Scr.findOne({
    //     email: email
    // });


    // let ifMatch = _.filter(exportFolio, {
    //     ticker: ticker
    // });
    // console.log('ifMatch', _.get(ifMatch[0], 'ticker', ""))


});

/**
 * @descr : Sell Stocks :: 
 * body :: accespts ticker, shares 
 * Returns success if able to remove/update to DB
 */
router.post('/sellStocks', auth, async (req, res) => {
    console.log('+++++++++++++++++++++++++++++Sell Stocks+++++++++++++++++++++++++++++')
    console.log(req.body, "BODY requested");
    let { ticker, shares } = req.body;
    

    if (!(ticker && shares)) {
        return res.status(400).send('ticker,shares  are required fields')
    }
    if (shares < 0) {
        return res.status(400).send('Share count can not be -ve')
    }
    let email = req.user.email
    let resr = await Scr.findOne({
        email: req.user.email
    });
    if(!resr){
        return res.status(404).send('user not found');
    }
    let exportFolio = resr.portfolio;
    let historyOfFolio = resr.history;
    // let currentReturns = req.user.currentReturn;
    let ifMatch = _.filter(exportFolio, {
        ticker: ticker
    });

    if (ifMatch && ifMatch.length > 0) {
        if (ifMatch[0].shares >= shares) {
            let newQTY = ifMatch[0].shares - shares;
            _.remove(exportFolio, {
                ticker: ticker
            });
            let pushObj = {
                "ticker": ticker,
                'shares': newQTY,
                'avgBuyPrice': ifMatch[0].avgBuyPrice
            }
            historyOfFolio.push({ ...req.body, type: 'SELL' });
            exportFolio.push(pushObj);

            try {
                let response = await Scr.findOneAndUpdate({
                    email: email
                }, {
                    portfolio: exportFolio,
                    history: historyOfFolio
                }, { new: true });

                return res.status(201).send(response)
            } catch (e) {
                return res.status(400).send('Some error occured' + e)
            }
        } else {
            return res.status(404).send('Sorry but you donot have that many shares')
        }
    } else {
        return res.status(404).send('Sorry but no assets are brought with this name')

    }
});


/**
 * @description::fetches the current portfolio of user
 * 
 */
router.get('/fetchPortfolio', auth, async (req, res) => {
    console.log('+++++++++++++++++++++++++++++Fetch FOLIO+++++++++++++++++++++++++++++');
    let resr = await Scr.findOne({
        email: req.user.email
    });
    if(!resr){
        return res.status(404).send('user not found');
    }
    return res.status(201).send(resr.portfolio)
});

/**
 * @description :: fetches the trade history
 * param:: ticker name
 */
router.get('/fetchTrades', auth, async (req, res) => {
    console.log('+++++++++++++++++++++++++++++Fetch Tardes+++++++++++++++++++++++++++++');
    let searchFor = req.query.ticker;
    if (!searchFor) {
        return res.status(400).send('No Ticker Mentioned');
    }
    searchFor = searchFor.toLowerCase();
    // console.log("Search FOR",searchFor)

    let resr = await Scr.findOne({
        email: req.user.email
    });
    if(!resr){
        return res.status(404).send('user not found');
    }
    let allAvailableTickers = resr.history.map(({ ticker }) => ticker.toLowerCase());
    // console.log(allAvailableTickers,"res")

    if (allAvailableTickers.includes(searchFor)) {
        let allTrades = _.filter(resr.history, (rr) => {
            if (rr.ticker.toLowerCase() === searchFor.toLowerCase()) {
                return rr
            }
        });
        return res.status(201).send(allTrades)
    } else {
        return res.status(404).send({
            Error: "No such asset exist for you"
        })
    }
})

/**
 * @description :: fetches totla return
 * Assumes that selling price of each ticker is 100
 */
router.get('/returns', auth, async (req, res) => {
    const sellingPrice = 100
    let sumV = 0;
    let resr = await Scr.findOne({
        email: req.user.email
    });
    if(!resr){
        return res.status(404).send('user not found');
    }
    let portfolio = resr.portfolio;
    _.forEach(portfolio, (asset) => {
        return sumV += ((sellingPrice - asset.avgBuyPrice) * asset.shares);
    });
    // console.log(sumV,"SUMV")
     return res.status(201).send({
         "return":sumV
     })
})

module.exports = router;