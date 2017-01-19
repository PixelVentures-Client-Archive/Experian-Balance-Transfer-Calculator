/*
* @Author: Craig Bojko (Craig Bojko)
* @Date:   2017-01-17 15:17:21
* @Last Modified by:   Craig Bojko (Craig Bojko)
* @Last Modified time: 2017-01-17 17:33:35
*/

import $ from 'jquery'
import html from '../templates/output.html'

const __DECIMALS = 2

let header1 = 'If you switch, it may take you less time to pay back your outstanding balance, and you could save £{{saving}}'
let header2 = 'If you switch, it won\'t take you any longer to pay back your outstanding balance, but you could save £{{saving}}'
let header3 = 'If you switch, it will take longer to pay back your outstanding balance, but you could save £{{saving}}'

export default class Output {
  constructor (inject) {
    this.el = html
    this.$inject = inject
  }

  displayResults (results) {
    let speed = results.case2.lengthSummary.toLowerCase()
    let headerText = header1
    switch (speed) {
      case ('faster'):
        headerText = header1
        break
      case ('same'):
        headerText = header2
        break
      case ('slower'):
        headerText = header3
        break
      default:
        break
    }

    var saving = results.case1.saving.toFixed(2)
    headerText = headerText.replace(/{{saving}}/, saving)

    this.$el = $(html({
      'outputHeader': headerText || '<n/a>',
      'fullRepaymentCurrent': results.paymentLengthCurrent + 'months' || '<n/a>',
      'totalInterestCurrent': '£' + results.interestSum1.toFixed(__DECIMALS) || '<n/a>',
      'fullRepaymentNew': results.case1.totalRepaymentLength + 'months' || '<n/a>',
      'totalInterestNew': '£' + results.interestPlusFee.toFixed(__DECIMALS) || '<n/a>'
    }))

    this.$inject.empty().append(this.$el)
    return true
  }
}
