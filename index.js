/*
* @Author: Craig Bojko (c14486a)
* @Date:   2016-12-13 12:32:03
* @Last Modified by:   Craig Bojko (Craig Bojko)
* @Last Modified time: 2017-01-05 13:50:07
*/

/* globals mboxTrack */

import './styles/main.less'
import $ from 'jquery'
import poll from './js/util/poller'
import html from './templates/main.html'
import Calculator from './js/calculator'

let ns = process.env.RFC_NAMESPACE
let env = process.env.NODE_ENV

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
  var $html = $(html({ns: ns}))
  let calculator = window.debug['calculator'] = new Calculator(10000, 220, 18.9, 24, 1.2)
  let calc = calculator.calculate()

  window.debug.repaymentGrids = calc

  $html.append('<p>CALC1: ' + calc.a + '</p>').appendTo('#main')
  $html.append('<p>CALC2: ' + calc.b + '</p>').appendTo('#main')
  $('body').show()
}
