/*
* @Author: Craig Bojko (c14486a)
* @Date:   2016-12-13 12:32:03
* @Last Modified by:   Craig Bojko (Craig Bojko)
* @Last Modified time: 2017-01-06 10:30:50
*/

/* globals mboxTrack */

import './styles/main.less'
import $ from 'jquery'
import poll from './js/util/poller'
import html from './templates/main.html'
import Calculator from './js/calculator'
import Pretty from './js/modules/prettyprint'

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

  window.debug.calulations = calc
  var $object = Pretty(calc)

  $html.appendTo('#main')
  $html.find('.object_dump').append($object)
  $('body').show()
}
