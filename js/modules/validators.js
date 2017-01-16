
import parseTo2DP from '../util/parseTo2DP'
import {displayError, hideError} from './userErrorHandling'

export default class Validator {

  constructor (_selector, _lowerBound, _upperBound) {
    // if (new.target === Abstract) {
    //   throw new TypeError('Cannot construct Abstract instances directly')
    // }
    this.selector = _selector
    this.lowerBound = _lowerBound
    this.upperBound = _upperBound
  }

  validate (event) {
    let $this = this.$el
    let check = this.rangeCheck()

    if (check) {
      hideError(1)
      $this.parent().removeClass('has-error').addClass('has-success')
      return true
    } else {
      displayError(1)
      $this.parent().removeClass('has-success').addClass('has-error')
      return false
    }
  }

  rangeCheck (... args) {
    let value = this.getValue()

    try {
      value = parseTo2DP(value)
    } catch (e) {
      console.error('ERROR parsing balanceTransfer input')
      return false
    }

    if (value < this.lowerBound || value > this.upperBound) {
      return false
    } else {
      return true
    }
  }
}
