/*
* @Author: Craig Bojko (Craig Bojko)
* @Date:   2016-12-13 15:50:53
* @Last Modified by:   Craig Bojko (Craig Bojko)
* @Last Modified time: 2017-01-17 17:27:26
*/

import PaymentGrid from './modules/paymentGrid'

let config = new WeakMap()
let paymentGrid1
let paymentGrid2

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
    let amountLeftAfterBTPeriod = config.get(this).transferBalance - this.calculatePaymentsWithinIntroPeriod()

    paymentGrid1 = new PaymentGrid(config.get(this).transferBalance, config.get(this).repayments, config.get(this).apr)
    paymentGrid2 = new PaymentGrid(amountLeftAfterBTPeriod, config.get(this).repayments, 18.9) // fixed 18.9% apr on new card

    return {
      grid1Pivot: paymentGrid1.getPivot(),
      grid2Pivot: paymentGrid2.getPivot(),
      paymentLengthCurrent: paymentGrid1.getLengthOfRepayment(),
      paymentLengthNew: config.get(this).ratePeriod + paymentGrid2.getLengthOfRepayment(),
      // paymentGrid1: paymentGrid1,
      // paymentGrid2: paymentGrid2,
      interestSum1: this.calcInterestInIntroPeriod(),
      interestSum2: this.calcInterestOutIntroPeriod(),
      fee: this.calculateFee(),
      payments1: this.calculatePaymentsWithinIntroPeriod(),
      payments2: this.calculatePaymentsOutsideIntroPeriod(),
      interestPlusFee: this.calculateInterestPlusFee(),
      case1: this.calculateCase1(),
      case2: this.calculateCase2()
    }
  }

  calcInterestInIntroPeriod () {
    return paymentGrid1.getInterestSum()
  }

  calcInterestOutIntroPeriod () {
    return paymentGrid2.getInterestSum()
  }

  calculateFee () {
    return config.get(this).transferBalance * (config.get(this).fee / 100)
  }

  calculatePaymentsWithinIntroPeriod () {
    return config.get(this).repayments * config.get(this).ratePeriod
  }

  calculatePaymentsOutsideIntroPeriod () {
    return config.get(this).transferBalance - this.calculatePaymentsWithinIntroPeriod()
  }

  calculateInterestPlusFee () {
    return this.calcInterestOutIntroPeriod() + this.calculateFee()
  }

  calculateCase1 () {
    let self = this
    let totalRepaymentLength = config.get(this).ratePeriod + paymentGrid2.getLengthOfRepayment()
    let totalQuickerMonths = paymentGrid1.getLengthOfRepayment() - (config.get(this).ratePeriod + paymentGrid2.getLengthOfRepayment())

    return {
      totalRepaymentLength: totalRepaymentLength,
      totalQuickerMonths: totalQuickerMonths,
      moreOrLess: (totalRepaymentLength > 0) ? 'Less' : 'More',
      saving: self.calcInterestInIntroPeriod() - self.calculateInterestPlusFee()
    }
  }

  calculateCase2 () {
    let completeBeforeEnd = config.get(this).ratePeriod > paymentGrid2.getLengthOfRepayment()
    let lengthWith0Percent = config.get(this).ratePeriod + paymentGrid2.getLengthOfRepayment() // Math.ceil(config.get(this).transferBalance / config.get(this).repayments)
    let paymentGrid1Length = paymentGrid1.getLengthOfRepayment()

    return {
      completeBeforeEnd: (completeBeforeEnd) ? 'Yes' : 'No',
      lengthWith0Percent: lengthWith0Percent,
      lengthSummary: (lengthWith0Percent < paymentGrid1Length) ? 'Faster' : (lengthWith0Percent === paymentGrid1Length) ? 'Same' : 'Slower'
    }
  }
}
