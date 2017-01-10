/*
* @Author: Craig Bojko (c14486a)
* @Date:   2016-12-13 12:32:03
* @Last Modified by:   Craig Bojko (Craig Bojko)
* @Last Modified time: 2017-01-10 17:21:10
*/

/* globals mboxTrack */

import './styles/main.less'
import $ from 'jquery'
import poll from './js/util/poller'
import html from './templates/main.html'
import Calculator from './js/calculator'
import Pretty from './js/util/prettyprint'
import parseTo2DP from './js/util/parseTo2DP'

import { validate as balanceTransferValidation } from './js/modules/validation/balanceTransfer'
import { validate as aprValidation } from './js/modules/validation/apr'
import { validate as repaymentsValidation } from './js/modules/validation/repayments'
import { validate as ratePeriodValidation } from './js/modules/validation/ratePeriod'
import { validate as transferfeeValidation } from './js/modules/validation/transferfee'
import { displayError } from './js/modules/userErrorHandling'

let ns = process.env.RFC_NAMESPACE
let env = process.env.NODE_ENV

let calculator

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

  bindValidation($html)
  bindEvents($html)

  $html.appendTo('#main')
  $html.find('.object_dump').append($object)
  $('body').show()
}

function bindValidation ($html) {
  // Balance Transfer
  $html.find('input[name="input-balanceTransfer"]')
    .on('keyup', balanceTransferValidation)
    .on('change', balanceTransferValidation)

  $html.find('input[name="input-apr"]')
    .on('keyup', aprValidation)
    .on('change', aprValidation)

  $html.find('input[name="input-repayments"]')
    .on('keyup', repaymentsValidation)
    .on('change', repaymentsValidation)

  $html.find('select[name="input-ratePeriod"]')
    .on('keyup', ratePeriodValidation)
    .on('change', ratePeriodValidation)

  $html.find('input[name="input-transferFee"]')
    .on('keyup', transferfeeValidation)
    .on('change', transferfeeValidation)

  $html.find('input[name="input-balanceTransfer"], input[name="input-apr"], input[name="input-repayments"], select[name="input-ratePeriod"], input[name="input-transferFee"]')
    .on('keyup', checkCalculate)
    .on('change', checkCalculate)
}

function bindEvents ($html) {
  $html.find('.btn.calculate').on('click', (event) => {
    if (allValidate()) {
      // new calculator instance
      let balance = parseTo2DP($html.find('input[name="input-balanceTransfer"]').val())
      let apr = parseTo2DP($html.find('input[name="input-apr"]').val())
      let repayments = parseTo2DP($html.find('input[name="input-repayments"]').val())
      let ratePeriod = parseTo2DP($html.find('select[name="input-ratePeriod"]').val())
      let fee = parseTo2DP($html.find('input[name="input-transferFee"]').val())

      calculator = window.debug['calculator'] = new Calculator(balance, repayments, apr, ratePeriod, fee)
      let calc = calculator.calculate()
      let $object = Pretty(calc)
      window.debug.calulations = calc
      $html.find('.object_dump').empty().append($object)
    } else {
      displayError(0)
      console.warn('WARNING: Validation not passing')
    }
  })
}

function allValidate () {
  if (balanceTransferValidation() &&
      aprValidation() &&
      repaymentsValidation() &&
      ratePeriodValidation() &&
      transferfeeValidation()
    ) {
    return true
  } else {
    return false
  }
}

function checkCalculate ($html) {
  let $this = $('.btn.calculate')
  if (allValidate()) {
    $this.removeAttr('disabled')
    return true
  } else {
    $this.attr('disabled', 'disabled')
    return false
  }
}
