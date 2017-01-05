/*
* @Author: Craig Bojko (Craig Bojko)
* @Date:   2016-12-13 15:50:53
* @Last Modified by:   Craig Bojko (Craig Bojko)
* @Last Modified time: 2017-01-05 13:56:38
*/

import PaymentGrid from './modules/paymentGrid'

let config = new WeakMap()

export default class Calculator {

  constructor (_transferBalance, _repayments, _apr, _ratePeriod, _fee) {
    config.set(this, {
      transferBalance: _transferBalance,
      repayments: _repayments,
      apr: _apr,
      ratePeriod: _ratePeriod,
      fee: _fee
    })
  }

  set transferBalance (tb) { config.get(this).transferBalance = tb }
  set repayments (r) { config.get(this).repayments = r }
  set apr (a) { config.get(this).apr = a }
  set ratePeriod (rp) { config.get(this).ratePeriod = rp }
  set fee (f) { config.get(this).fee = f }

  get transferBalance () { return config.get(this).transferBalance }
  get repayments () { return config.get(this).repayments }
  get apr () { return config.get(this).apr }
  get ratePeriod () { return config.get(this).ratePeriod }
  get fee () { return config.get(this).fee }

  calculate () {
    let paymentGrid1 = new PaymentGrid(config.get(this).transferBalance, config.get(this).repayments, config.get(this).apr)
    let paymentGrid2 = new PaymentGrid(4720, config.get(this).repayments, config.get(this).apr)

    let grid1Pivot = paymentGrid1.getPivot()
    let grid2Pivot = paymentGrid2.getPivot()
    return {
      a: grid1Pivot,
      b: grid2Pivot
    }
  }

}
