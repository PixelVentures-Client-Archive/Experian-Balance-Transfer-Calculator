/*
* @Author: Craig Bojko (c14486a)
* @Date:   2016-12-13 12:32:03
* @Last Modified by:   Craig Bojko (Craig Bojko)
* @Last Modified time: 2017-01-06 16:47:26
*/

/* globals mboxTrack */

import './styles/main.less'
import $ from 'jquery'
import poll from './js/util/poller'
import html from './templates/main.html'
import Calculator from './js/calculator'
import Pretty from './js/modules/prettyprint'
import parseTo2DP from './js/modules/parseTo2DP'

import { validate as balanceTransferValidation } from './js/modules/validation/balanceTransfer'

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
}

function bindEvents ($html) {
  $html.find('.btn.calculate').on('click', (event) => {
    if (balanceTransferValidation) {
      // new calculator instance
      let balance = parseTo2DP($html.find('input[name="input-balanceTransfer"]').val())
      let apr = parseTo2DP($html.find('input[name="input-apr"]').val())
      let repayments = parseTo2DP($html.find('input[name="input-repayments"]').val())
      let ratePeriod = parseTo2DP($html.find('select[name="input-ratePeriod"]').val())
      let fee = parseTo2DP($html.find('select[name="input-transferFee"]').val())

      calculator = window.debug['calculator'] = new Calculator(balance, repayments, apr, ratePeriod, fee)
      let calc = calculator.calculate()
      let $object = Pretty(calc)
      window.debug.calulations = calc
      $html.find('.object_dump').empty().append($object)
    } else {
      console.warn('WARNING: Validation not passing')
    }
  })
}
