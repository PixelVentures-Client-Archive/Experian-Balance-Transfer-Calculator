
import Validator from '../validators'

const selector = 'input[name="input-balanceTransfer"]'
const lowerBound = 0
const upperBound = 100000

export default class BalanceTransferInput extends Validator {

  constructor ($html) {
    super(selector, lowerBound, upperBound)
    this.$el = $html.find(this.getSelector())
    this.$el.on('keyup change', this.validate.bind(this))
  }

  validate (event) {
    return super.validate(event)
  }

  rangeCheck (event) {
    return super.rangeCheck(event)
  }

  getSelector () {
    return selector
  }

  getValue () {
    return this.$el.val()
  }
}
