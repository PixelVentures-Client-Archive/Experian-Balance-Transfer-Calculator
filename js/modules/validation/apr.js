
import $ from 'jquery'
import parseTo2DP from '../../util/parseTo2DP'
import {displayError, hideError} from '../userErrorHandling'

export function validate (event) {
  let $this = $(this)
  let value = 0

  try {
    value = parseTo2DP($this.val())
  } catch (e) {
    console.error('ERROR parsing apr input')
    return false
  }

  if (value < 0 || value > 39.9) {
    displayError(2)
    $this.parent().removeClass('has-success').addClass('has-error')
    return false
  } else {
    hideError(2)
    $this.parent().removeClass('has-error').addClass('has-success')
    return true
  }
}
