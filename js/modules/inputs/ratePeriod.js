
import Validator from '../validators'

const selector = 'select[name="input-ratePeriod"]'
const lowerBound = 1
const upperBound = 60

export default class RatePeriodInput extends Validator {

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
