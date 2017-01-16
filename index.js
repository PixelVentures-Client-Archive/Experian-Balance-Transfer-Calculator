/*
* @Author: Craig Bojko (c14486a)
* @Date:   2016-12-13 12:32:03
* @Last Modified by:   Craig Bojko (Craig Bojko)
* @Last Modified time: 2017-01-16 11:31:49
*/

/* globals mboxTrack */

import './styles/main.less'
import $ from 'jquery'
import poll from './js/util/poller'
import html from './templates/main.html'
import Calculator from './js/calculator'
import Pretty from './js/util/prettyprint'
import parseTo2DP from './js/util/parseTo2DP'

import BalanceTransferInput from './js/modules/inputs/balanceTransfer'
import APRInput from './js/modules/inputs/apr'
import RepaymentsInput from './js/modules/inputs/repayments'
import RatePeriodInput from './js/modules/inputs/ratePeriod'
import TransferFeeInput from './js/modules/inputs/transferfee'
import { displayError } from './js/modules/userErrorHandling'

let ns = process.env.RFC_NAMESPACE
let env = process.env.NODE_ENV

let calculator
let balanceTransferInput
let aprInput
let repaymentsInput
let ratePeriodInput
let transferFeeInput

let domDependancies = [
  '#main'
]

// Script entry
console.group()
console.info('RFC: %s', ns)
console.info('ENV: %s', env)
window.debug = {
  $: $
}

poll($, domDependancies, init)
console.groupEnd()

/**
 * Primary function to begin module execution - runs after Polling complete
 * @return {void} - return not necessary
 */
function init () {
  let $html = $(html({ns: ns}))
  calculator = window.debug['calculator'] = new Calculator(10000, 220, 18.9, 24, 1.2)

  let calc = calculator.calculate()
  let $object = Pretty(calc)
  window.debug.calulations = calc

  initialiseInputs($html)
  bindEvents($html)

  $html.appendTo('#main')
  $html.find('.object_dump').append($object)
  $('body').show()
}

function initialiseInputs ($html) {
  balanceTransferInput = new BalanceTransferInput($html)
  aprInput = new APRInput($html)
  repaymentsInput = new RepaymentsInput($html)
  ratePeriodInput = new RatePeriodInput($html)
  transferFeeInput = new TransferFeeInput($html)

  $html.find('input[name="input-balanceTransfer"], input[name="input-apr"], input[name="input-repayments"], select[name="input-ratePeriod"], input[name="input-transferFee"]').on('keyup change', checkCalculate)
}

function bindEvents ($html) {
  $html.find('.btn.calculate').on('click', (event) => {
    if (allValidate()) {
      // new calculator instance
      let balance = parseTo2DP(balanceTransferInput.getValue())
      let apr = parseTo2DP(aprInput.getValue())
      let repayments = parseTo2DP(repaymentsInput.getValue())
      let ratePeriod = parseTo2DP(ratePeriodInput.getValue())
      let fee = parseTo2DP(transferFeeInput.getValue())

      calculator = window.debug['calculator'] = new Calculator(balance, repayments, apr, ratePeriod, fee)
      let calc = window.debug.calulations = calculator.calculate()
      let $object = Pretty(calc)
      $html.find('.object_dump').empty().append($object)
    } else {
      displayError(0)
      console.warn('WARNING: Validation not passing')
    }
  })
}

function allValidate (event) {
  if (balanceTransferInput.rangeCheck() &&
      aprInput.rangeCheck() &&
      repaymentsInput.rangeCheck() &&
      ratePeriodInput.rangeCheck() &&
      transferFeeInput.rangeCheck()
    ) {
    return true
  } else {
    return false
  }
}

function checkCalculate (event) {
  let $this = $('.btn.calculate')
  if (allValidate(event) === true) {
    $this.removeAttr('disabled')
    return true
  } else {
    $this.attr('disabled', 'disabled')
    return false
  }
}
