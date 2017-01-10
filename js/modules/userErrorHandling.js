
import $ from 'jquery'

let currentErrorCode = -1
let errorTimeout = -1

let errorMap = [
  'Error in form - please check inputs', // 0 - generic
  'Range must be between 0 - 100000', // 1 - balance transfer range error
  'Range must be between 0 - 39.9', // 1 - apr range error
  'Range must be between 5 - 10000', // 1 - repayment range error
  'Range must be between 1 - 60', // 1 - rate period range error
  'Range must be between 0 - 5' // 1 - transfer fee range error
]

export function displayError (code) {
  let $error = $('#error_display')

  currentErrorCode = code
  $error.text(errorMap[code])
  $error.fadeIn()

  errorTimeout = setTimeout(function () {
    $error.fadeOut()
    currentErrorCode = -1
  }, 10000)
}

export function hideError (code) {
  if (currentErrorCode === code) {
    clearTimeout(errorTimeout)
    $('#error_display').fadeOut()
    currentErrorCode = -1
  }
}
