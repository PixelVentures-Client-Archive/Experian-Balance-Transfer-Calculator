
import $ from 'jquery'

let currentErrorCode = -1
let errorTimeout = -1

let errorMap = [
  '', // 0 - empty
  'Range must be between 0 - 100000' // 1 - balance transfer range error
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
