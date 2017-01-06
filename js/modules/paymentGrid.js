/*
* @Author: Craig Bojko (Craig Bojko)
* @Date:   2017-01-05 11:54:30
* @Last Modified by:   Craig Bojko (Craig Bojko)
* @Last Modified time: 2017-01-05 16:47:49
*/

const MaxLengthOfRepayments = 240 // 20yrs in months

export default class PaymentGrid {

  constructor (_btAmount, _repayment, _apr) {
    this.btAmount = _btAmount
    this.repaymentAmount = _repayment
    this.apr = _apr
    this.repaymentArray = []
    this.pivot = -1

    try {
      let _mApr = parseFloat((this.apr / 100).toFixed(3))
      this.monthlyApr = Math.pow(1 + _mApr, 1 / 12) - 1
    } catch (e) {
      console.error('ERROR calculating monthlyApr: ', e)
      return false
    }

    this.calculateArray()
  }

  calculateArray () {
    let i = 1
    let balanceAmount = this.btAmount

    // starting amount
    this.repaymentArray[0] = {
      balance: parseFloat(balanceAmount.toFixed(3), 10),
      interest: parseFloat((balanceAmount * this.monthlyApr).toFixed(4), 10)
    }

    while (i < MaxLengthOfRepayments) {
      let prevBalance = this.repaymentArray[i - 1].balance
      let prevInterest = this.repaymentArray[i - 1].interest
      balanceAmount = prevBalance - this.repaymentAmount + prevInterest
      this.repaymentArray[i] = {
        balance: parseFloat(balanceAmount.toFixed(3), 10),
        interest: parseFloat((balanceAmount * this.monthlyApr).toFixed(4), 10)
      }
      i++
    }
    // @TODO - error checking for 0-240 range for pivot (outside of payment window)
    for (let j = 0; j < this.repaymentArray.length; j++) {
      try {
        let currMonth = this.repaymentArray[j]
        if (currMonth.balance < 0) {
          this.pivot = j - 1
          break
        }
      } catch (e) {
        console.error('ERROR getting PaymentGrid pivot: ', e)
      }
    }
  }

  getPivot () {
    return this.pivot
  }

  getLengthOfRepayment () {
    return this.pivot + 1
  }

  getInterestSum () {
    let i = 0
    let sumInterest = 0
    while (i < MaxLengthOfRepayments) {
      if (this.repaymentArray[i].interest > 0) {
        sumInterest += this.repaymentArray[i].interest
      }
      i++
    }
    return sumInterest
  }

}
